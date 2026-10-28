# Sentinel IFM — Website

Marketing site for **Sentinel IFM Pvt. Ltd.** (formerly SNSS Global Services), an integrated facilities management company serving Mumbai, Pune, Ahmedabad and Bhopal. React 18 + Vite + Tailwind CSS v4, deployed on Vercel.

> Originally scaffolded from a Figma Make export: https://www.figma.com/design/zDWtGHJfHPtGkYFjZN3d0s/Build-responsive-single-page-website

## Stack

- **Build:** Vite 6, TypeScript, pnpm
- **UI:** React 18, Tailwind CSS v4, `motion` for animation
- **Routing:** React Router v7, browser history (`/about`, not `/#/about`). `vercel.json` rewrites unknown paths to `index.html`.
- **Forms:** [Web3Forms](https://web3forms.com), called directly from the browser
- **Labour Law Assist:** Vercel serverless function (`api/labour-assist.ts`) calling Groq, with optional Tavily web search
- **Runtime dependencies:** only `react`, `react-dom`, `react-router`, `motion`

## Commands

```bash
pnpm install
pnpm dev          # Vite dev server (the /api function only runs under `vercel dev` or in production)
pnpm typecheck    # tsc --noEmit
pnpm test         # API tests (rate limit, history sanitising, guardrails, retrieval, handler)
pnpm build        # typecheck + vite build + per-route meta pages (scripts/prerender-meta.mjs)
```

## Environment variables

Copy `.env.example` to `.env`; on Vercel set the same names in Project Settings.

| Name | Where it runs | Purpose |
|---|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | browser (public by design) | Contact and Careers forms. Restrict the key to your domain in the Web3Forms dashboard. |
| `GROQ_API_KEY` | server only | LLM for Labour Law Assist. Without it `/api/labour-assist` returns 503 and the page falls back to a local answer. |
| `TAVILY_API_KEY` | server only, optional | Live web search against Indian government sites. |

Never commit real keys; `.env` is gitignored.

## Site URL and branding

`src/app/site.ts` holds `SITE_URL` and `SITE_NAME`. They feed the canonical/OG tags and the build script. `public/sitemap.xml` and `public/robots.txt` are static, so update the domain there as well if it changes.

## Project structure

```
api/labour-assist.ts      Serverless function: rate limit, input validation, retrieval, Groq call, guardrails
scripts/prerender-meta.mjs  Post-build: dist/<route>/index.html with per-page title/OG/canonical + sitemap lastmod
tests/api.test.mjs        node:test suite (bundled with esbuild)
src/
  app/
    site.ts, routes.tsx, constants.tsx (colours, services, certifications, timeline)
    components/Layout.tsx, FadeIn.tsx
    pages/                Home, About, Services, ServiceDetail, Compliance, Careers, Contact,
                          LabourLawAssist, Privacy, Terms, NotFound
    hooks/useSEO.ts       Client-side title/meta updates on navigation
  lib/
    retrieve.ts           Pure keyword retrieval (stop words, whole-word match); used by browser and API
    rag.ts, prompts.ts, guardrails.ts
  data/labour-law-dataset.json   Curated legal entries (shipped with the function via vercel.json)
  assets/images/          WebP images (see "Images")
  imports/                Historical PRD/TRS/handover docs. Written for the old SNSS name and a Next.js plan; not current.
```

## Labour Law Assist

`/assist`. Answers Indian labour-law questions with a profile (state, role, sector).

- The browser sends only `{ query, profile, history }`. The server does its own retrieval from the dataset and builds the prompt, so clients cannot supply "legal context".
- Server limits: 15 requests/hour/IP (in-memory, per instance), 1,000-character queries, 12 KB bodies, history reduced to user/assistant turns.
- Guardrails: scope-limited system prompt, overconfident phrasing rewritten, escalation and "not legal advice" notes appended.
- Chats and profile live in `localStorage` only; the sidebar has "Clear all chats".
- The dataset is 23 hand-curated entries (last updated June 2026). **Have it reviewed against current Labour Code notifications before relying on it.**

## Images

Source images in `src/assets/images/` are WebP, capped at 1600 px (heroes), 900 px (service cards) and 400 px (badges/logo). Add new images as WebP (or convert with `sharp`) rather than PNG; a 2 MB PNG hero costs a phone user a full second on 4G.

## Deployment

Vercel builds with `pnpm build` and serves `dist/`. Static route pages written by `prerender-meta.mjs` take precedence over the SPA rewrite, so crawlers and link previews get the right metadata without running JavaScript. `vercel.json` also sets the security headers and CSP; if you add a third-party script, image host or iframe, add it there.

## Known limitations

- Page body text is still rendered client-side (only metadata is prerendered).
- The API rate limit is per server instance; use a shared store (e.g. Upstash Redis) if abuse appears.
- The Careers form cannot attach a résumé on Web3Forms' free plan.
- Some photos still show the old SNSS signage.
