import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'


function figmaAssetResolver(): Plugin {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

const SYSTEM_PROMPT = `You are Labour Law Assist, an AI assistant specialised in Indian labour and employment law.

STRICT RULES:
1. SCOPE: ONLY answer questions about Indian labour law — wages, termination, PF/EPF, ESI/ESIC, gratuity, maternity, POSH, leave, working hours, contract labour, Shops & Establishments, minimum wages. For ANYTHING outside this scope, reply: "I can only help with Indian labour law topics." and stop.
2. GROUNDING: Use RETRIEVED LEGAL CONTEXT first (verified act and section numbers). Supplement with WEB SEARCH RESULTS when provided. Never invent act names or section numbers.
3. PERSONALIZATION: Tailor the answer to the user's state, role, and sector.
4. RESPONSE FORMAT:
   a. One sentence acknowledging the situation.
   b. Applicable act name + section from retrieved context or web results.
   c. What this means for this specific user.
   d. 2-4 practical, numbered next steps.
   e. Escalation note for termination / POSH / disputes.
5. GUARDRAILS: Never draft legal notices. Never predict outcomes with certainty. Use: "generally", "in most cases", "subject to facts".
6. HONESTY: If you do not have a current rate, say so and direct user to the official state labour department website. Do NOT invent numbers.
7. CITATIONS: When using web search results, include the source URL inline.
8. LENGTH: Under 400 words. Bullet points over paragraphs.`

// Tavily web search — real results from Indian government sources
async function tavilySearch(query: string, state: string, apiKey: string): Promise<{ snippets: string; urls: string[] }> {
  try {
    const searchQuery = state && state !== 'Other'
      ? `${query} ${state} India labour law`
      : `${query} India labour law`

    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: searchQuery,
        search_depth: 'basic',
        include_answer: true,
        include_domains: [
          'labour.gov.in', 'epfindia.gov.in', 'esic.in',
          'indiacode.nic.in', 'dge.gov.in', 'clc.gov.in',
          'legislative.gov.in', 'labour.nic.in', 'main.sci.gov.in',
        ],
        max_results: 4,
      }),
      signal: AbortSignal.timeout(6000),
    })

    if (!res.ok) {
      console.error('[tavily dev]', res.status, await res.text())
      return { snippets: '', urls: [] }
    }

    const data = await res.json() as {
      answer?: string
      results?: Array<{ title: string; url: string; content: string }>
    }

    const parts: string[] = []
    const urls: string[] = []

    if (data.answer) parts.push(`Summary: ${data.answer}`)

    for (const r of (data.results || []).slice(0, 3)) {
      if (r.content) {
        parts.push(`[${r.title}] (${r.url}):\n${r.content.slice(0, 500)}`)
        urls.push(r.url)
      }
    }

    return { snippets: parts.join('\n\n'), urls }
  } catch (err) {
    console.error('[tavily dev] search failed:', err)
    return { snippets: '', urls: [] }
  }
}

// Dev-only middleware — mirrors /api/labour-assist Vercel function locally.
// Both GROQ_API_KEY and TAVILY_API_KEY are read from .env (never sent to browser).
function labourAssistDevProxy(env: Record<string, string>): Plugin {
  return {
    name: 'labour-assist-dev-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/labour-assist', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405); res.end('Method not allowed'); return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const { query, profile, history, ragContext, ragScore } = JSON.parse(body)

            if (!query || query.trim().length < 5) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Query too short.' })); return
            }
            if (query.length > 1000) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Query too long.' })); return
            }

            const groqKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY
            if (!groqKey) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'GROQ_API_KEY not set in .env' })); return
            }

            const hasRag = typeof ragScore === 'number' ? ragScore > 0 : !!ragContext
            const wantsLiveData = /current|latest|2024|2025|2026|notif|notification|today|now|recent|rate/i.test(query)
            const needsWebSearch = !hasRag || (typeof ragScore === 'number' && ragScore < 2) || wantsLiveData

            const tavilyKey = env.TAVILY_API_KEY || process.env.TAVILY_API_KEY
            const { snippets: webSnippets, urls: webUrls } =
              tavilyKey && needsWebSearch
                ? await tavilySearch(query.trim(), profile?.state || '', tavilyKey)
                : { snippets: '', urls: [] }

            const hasWeb = webSnippets.length > 0

            const profileCtx = `USER PROFILE:
- Role: ${profile?.role || 'unspecified'}
- State: ${profile?.state || 'unspecified'}
- Sector: ${profile?.sector || 'unspecified'}`

            const ragSection = ragContext
              ? `RETRIEVED LEGAL CONTEXT (cite only from this):\n${ragContext}`
              : 'RETRIEVED LEGAL CONTEXT: No matching sections found in the local knowledge base.'

            const webSection = hasWeb
              ? `WEB SEARCH RESULTS (Indian government sources — cite URLs when used):\n${webSnippets}`
              : ''

            const systemContent = [SYSTEM_PROMPT, profileCtx, ragSection, webSection]
              .filter(Boolean).join('\n\n')

            const orRes = await fetch(GROQ_API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqKey}`,
              },
              body: JSON.stringify({
                model: MODEL,
                messages: [
                  { role: 'system', content: systemContent },
                  ...(history || []).slice(-6),
                  { role: 'user', content: query.trim() },
                ],
                max_tokens: 750,
                temperature: 0.3,
              }),
            })

            if (!orRes.ok) {
              console.error('[labour-assist dev]', orRes.status, await orRes.text())
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'OpenRouter unavailable. Using local fallback.' })); return
            }

            const data = await orRes.json() as { choices?: Array<{ message?: { content?: string } }> }
            const content = data?.choices?.[0]?.message?.content || ''

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ content, usedWebSearch: hasWeb, webSources: webUrls }))
          } catch (err) {
            console.error('[labour-assist dev]', err)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal error.' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load ALL vars from .env (third arg '' lifts the VITE_ prefix filter) so the
  // dev-only API middleware can read GROQ_API_KEY / TAVILY_API_KEY. These stay
  // server-side — only VITE_* vars are ever exposed to the browser bundle.
  const env = loadEnv(mode, process.cwd(), '')

  return {
  plugins: [
    figmaAssetResolver(),
    labourAssistDevProxy(env),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
