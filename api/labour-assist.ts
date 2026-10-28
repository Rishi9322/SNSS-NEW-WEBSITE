import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { retrieve, type DatasetEntry } from "../src/lib/retrieve.js";
import { buildRagContext } from "../src/lib/prompts.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
// Groq free tier: 14,400 req/day, 6,000 tokens/min — no credit card required
// Override with GROQ_MODEL (e.g. openai/gpt-oss-120b for better accuracy, lower free-tier headroom).
// Groq retires models without notice; a 404 model_not_found in the runtime logs means pick a new one.
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const MAX_QUERY_CHARS = 1000;
const MAX_BODY_BYTES = 12_000;
const MAX_HISTORY_TURNS = 3;
const GROQ_TIMEOUT_MS = 25_000; // fail fast; the browser falls back to the local answer
const MAX_OUTPUT_TOKENS = 1500; // gpt-oss models spend part of this on reasoning before the answer

// ─── Guardrails ───────────────────────────────────────────────────────────────

const OVERCONFIDENT: Array<[RegExp, string]> = [
  [/\byou(?:'ll| will)(?: definitely| certainly| surely| absolutely)? (?:win|prevail)\b/gi, "you may have grounds to argue"],
  [/\byou(?:'re| are)(?: definitely| certainly| surely)? (?:guaranteed|certain to (?:win|succeed))\b/gi, "you may be entitled"],
  [/\b(?:the )?(?:court|tribunal|labour court) will (?:definitely |certainly )?(?:order|rule|side)\b/gi, "a court may consider ordering"],
  [/\byou(?:'ll| will)(?: definitely| certainly)? (?:get|receive)\b/gi, "you may be entitled to claim"],
  [/\bthey (?:must|have to|will have to) pay you\b/gi, "they may be required to pay"],
  [/\b(?:100% (?:sure|certain|guaranteed)|without (?:a )?doubt)\b/gi, "subject to facts"],
];

const ESCALATION_RE = /termination|terminated|fired|retrench|dismiss|sacked|posh|sexual harass|labour court|conciliation|wrongful/i;

// ─── Abuse protection ─────────────────────────────────────────────────────────
// ponytail: per-instance memory — a determined caller spread across cold instances
// gets more; move to Upstash/Vercel KV rate limiting if abuse shows up in Groq usage.

const RATE_WINDOW_MS = 3_600_000;
const RATE_MAX_PER_WINDOW = 15;
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) { // keep the map from growing without bound
    for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  }
  return false;
}

function clientIp(req: VercelRequest): string {
  const real = req.headers["x-real-ip"];
  if (typeof real === "string" && real) return real;
  const xff = req.headers["x-forwarded-for"];
  return (typeof xff === "string" ? xff.split(",")[0].trim() : "") || "unknown";
}

/** Only genuine user/assistant turns survive; clients can't inject system messages. */
export function sanitizeHistory(raw: unknown): Array<{ role: "user" | "assistant"; content: string }> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const m of raw.slice(-MAX_HISTORY_TURNS * 2)) {
    if (!m || typeof m !== "object") continue;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role === "user" || role === "assistant") && typeof content === "string" && content.trim()) {
      out.push({ role, content: content.slice(0, 1500) });
    }
  }
  return out;
}

function cleanField(v: unknown): string {
  return typeof v === "string" ? v.replace(/[^A-Za-z0-9 &,.()/-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40) : "";
}

// ─── Knowledge base (server-side retrieval; the client is not trusted) ───────

let kb: DatasetEntry[] | null = null;
function loadKb(): DatasetEntry[] {
  if (!kb) {
    // vercel.json functions.includeFiles ships this file with the function
    const raw = JSON.parse(readFileSync(join(process.cwd(), "src/data/labour-law-dataset.json"), "utf8"));
    kb = raw.entries ?? [];
  }
  return kb!;
}

export function applyGuardrails(text: string, hasRag: boolean, hasWeb: boolean, escalation: boolean): string {
  let out = text.trim();

  for (const [pat, fix] of OVERCONFIDENT) {
    out = out.replace(pat, fix);
  }

  if (escalation && !out.toLowerCase().includes("consult a qualified")) {
    out += "\n\n⚠️ Your situation may involve termination, POSH, or a potential dispute. This tool provides general information only. Strongly consider consulting a qualified labour lawyer or the appropriate authority (Labour Commissioner, Internal Complaints Committee, etc.).";
  }

  if (!out.toLowerCase().includes("not legal advice")) {
    out += "\n\nThis is not legal advice. Labour laws vary by state and change over time. Verify current rules with official sources.";
  }

  if (!hasRag && !hasWeb) {
    out += "\n\nNote: No specific provision was found in the local knowledge base for this query. The answer is based on general principles — please verify with current official notifications.";
  }

  return out;
}

// ─── Tavily web search ────────────────────────────────────────────────────────

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

async function tavilySearch(
  query: string,
  state: string,
  apiKey: string
): Promise<{ snippets: string; urls: string[] }> {
  try {
    const searchQuery = state && state !== "Other"
      ? `${query} ${state} India labour law`
      : `${query} India labour law`;

    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: searchQuery,
        search_depth: "basic",
        include_answer: true,
        include_domains: [
          "labour.gov.in",
          "epfindia.gov.in",
          "esic.in",
          "indiacode.nic.in",
          "dge.gov.in",
          "clc.gov.in",
          "legislative.gov.in",
          "labour.nic.in",
          "main.sci.gov.in",
        ],
        max_results: 4,
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      console.error("Tavily error:", res.status, await res.text());
      return { snippets: "", urls: [] };
    }

    const data = await res.json() as { answer?: string; results?: TavilyResult[] };

    const parts: string[] = [];
    const urls: string[] = [];

    if (data.answer) {
      parts.push(`Summary: ${data.answer}`);
    }

    for (const r of (data.results || []).slice(0, 3)) {
      if (r.content) {
        parts.push(`[${r.title}] (${r.url}):\n${r.content.slice(0, 500)}`);
        urls.push(r.url);
      }
    }

    return {
      snippets: parts.length > 0 ? parts.join("\n\n") : "",
      urls,
    };
  } catch (err) {
    console.error("Tavily search failed:", err);
    return { snippets: "", urls: [] };
  }
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Labour Law Assist, an AI assistant specialised in Indian labour and employment law.

STRICT RULES:
1. SCOPE: ONLY answer questions about Indian labour law — wages, termination, PF/EPF, ESI/ESIC, gratuity, maternity, POSH, leave, working hours, contract labour, Shops & Establishments, minimum wages. For ANYTHING outside this scope, reply: "I can only help with Indian labour law topics." and stop.
2. GROUNDING: Use RETRIEVED LEGAL CONTEXT first (it has verified act and section numbers). Supplement with WEB SEARCH RESULTS when provided. Never invent act names or section numbers.
3. PERSONALIZATION: Tailor the answer to the user's state, role, and sector.
4. RESPONSE FORMAT:
   a. One sentence acknowledging the situation.
   b. Applicable act name + section from retrieved context or web results.
   c. What this means for this specific user.
   d. 2–4 practical, numbered next steps.
   e. Escalation note for termination / POSH / disputes.
5. GUARDRAILS: Never draft legal notices. Never predict outcomes with certainty. Use: "generally", "in most cases", "subject to facts".
6. HONESTY: If you do not have a current rate (e.g. state minimum wage), say "I do not have the current notified rate — check the official state labour department website." Do NOT invent numbers.
7. CITATIONS: When using web search results, include the source URL inline, e.g. (Source: https://...).
8. LENGTH: Under 400 words. Bullet points over paragraphs.
9. CURRENCY: India's four Labour Codes (wages, industrial relations, social security, occupational safety) may have replaced or changed older Acts such as the Payment of Gratuity Act, the Industrial Disputes Act, the EPF Act and the Minimum Wages Act. Whenever you cite one of those older Acts, add one sentence saying the Labour Codes may have replaced or changed it and that the user must confirm the current provision.`;

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (rateLimited(clientIp(req))) {
    res.setHeader("Retry-After", "3600");
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request too large." });
  }

  const { query, profile: rawProfile, history: rawHistory } = req.body || {};
  const profile = { role: cleanField(rawProfile?.role), state: cleanField(rawProfile?.state), sector: cleanField(rawProfile?.sector) };
  const history = sanitizeHistory(rawHistory);

  if (!query || typeof query !== "string" || query.trim().length < 5) {
    return res.status(400).json({ error: "Query is too short." });
  }
  if (query.length > MAX_QUERY_CHARS) {
    return res.status(400).json({ error: `Query must be under ${MAX_QUERY_CHARS} characters.` });
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return res.status(503).json({ error: "AI service not configured." });
  }

  // Retrieval runs here, never from client-supplied "context".
  const chunks = retrieve(loadKb(), query.trim(), 4);
  const ragContext = chunks.length ? buildRagContext(chunks) : "";
  const ragScore = chunks.length ? Math.max(...chunks.map((c) => c.relevance)) : 0;
  const hasRag = ragScore > 0;

  // Search when RAG has low relevance OR user is asking for current/live data
  const wantsLiveData = /current|latest|2024|2025|2026|notif|notification|today|now|recent|rate/i.test(query);
  const needsWebSearch = !hasRag || ragScore < 2 || wantsLiveData;

  const tavilyKey = process.env.TAVILY_API_KEY;
  const { snippets: webSnippets, urls: webUrls } =
    tavilyKey && needsWebSearch
      ? await tavilySearch(query.trim(), profile.state, tavilyKey)
      : { snippets: "", urls: [] };

  const hasWeb = webSnippets.length > 0;

  // Build system message
  const profileContext = `USER PROFILE:
- Role: ${profile.role || "not specified"}
- State: ${profile.state || "not specified"}
- Sector: ${profile.sector || "not specified"}`;

  const ragSection = ragContext
    ? `RETRIEVED LEGAL CONTEXT (cite only from this — do not invent section numbers):\n${ragContext}`
    : "RETRIEVED LEGAL CONTEXT: No matching sections found in the local knowledge base.";

  const webSection = hasWeb
    ? `WEB SEARCH RESULTS (Indian government sources — cite URLs when used):\n${webSnippets}`
    : "";

  const systemContent = [SYSTEM_PROMPT, profileContext, ragSection, webSection]
    .filter(Boolean)
    .join("\n\n");

  const messages = [
    { role: "system", content: systemContent },
    ...history,
    { role: "user", content: query.trim() },
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.3,
        ...(MODEL.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}), // only the gpt-oss models accept this
        stream: false,
      }),
      signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[labour-assist] Groq error:", response.status, err);
      return res.status(502).json({ error: "AI service unavailable." });
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data?.choices?.[0]?.message?.content || "";

    if (!raw) {
      return res.status(502).json({ error: "Empty response from AI." });
    }

    const content = applyGuardrails(raw, hasRag, hasWeb, ESCALATION_RE.test(query) || ESCALATION_RE.test(raw));

    return res.status(200).json({
      content,
      usedWebSearch: hasWeb,
      webSources: webUrls,
      citations: chunks.slice(0, 3).map((c) => ({ act: c.entry.act, section: c.entry.section, source: c.entry.source })),
    });
  } catch (err) {
    console.error("Labour assist error:", err);
    return res.status(502).json({ error: "AI service unavailable." });
  }
}
