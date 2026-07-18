---
name: verify
description: Build, launch, and drive this site (SNSS marketing SPA + Labour Law Assist chat) to verify changes end-to-end in a real browser.
---

# Verifying this project

## Launch
- `pnpm dev` → Vite dev server on http://localhost:5173 (background it).
- The `/api/labour-assist` endpoint works in dev via a middleware in `vite.config.ts` that mirrors the Vercel function. It needs `GROQ_API_KEY` (and optionally `TAVILY_API_KEY`) in `.env` — loaded via `loadEnv` in the config. Without the key it returns 503 and the chat UI silently falls back to canned local responses.
- `pnpm build` for a production build check. There is NO tsconfig/tsc — Vite strips types without checking, so the build is the only compile gate.

## Drive (browser)
- No Playwright in the repo. Use `playwright-core` (npm i in scratchpad) with the system Edge: `chromium.launch({ channel: "msedge", headless: true })`.
- Chat page: `/assist`. Useful selectors:
  - textarea: `page.locator("textarea")`; send with `press("Enter")`.
  - message bubbles: `.whitespace-pre-wrap` (one per message).
  - sidebar thread rows: `aside .space-y-1 > div` (each row's inner `button` is delete ×).
  - quick-start buttons (empty state): `button.rounded-xl.text-left` — do NOT use `.grid button`, the page layout grid makes that match sidebar delete buttons.
  - inline validation error: `[role="alert"]`.
- State lives in localStorage keys `lla_threads`, `lla_current_thread`, `lla_profile`, `lla_rate`. Fresh browser context = clean state. To test the rate limit, pre-seed `lla_rate` with `hourCount: 15`.

## Flows worth driving
1. Fresh /assist → ask a question → user msg + AI reply must land in ONE sidebar thread.
2. Follow-up stays in same thread; reload persists it.
3. Short query ("hi") → inline error banner, no browser alert().
4. Off-topic query → guardrail refusal message.
5. New Chat → quick-start click → renames the same thread, no duplicate.
6. Delete all threads → reload → must stay deleted.
7. Watch `page.on("response")` for `/api/labour-assist`: 200 = real Groq path; 4xx/5xx = UI falls back silently to local canned answers (still looks like it "works").

## Smoke
All routes render under BrowserRouter (dev serves SPA fallback automatically):
`/ /about /services /services/housekeeping /compliance /careers /contact /privacy /terms /assist` + a 404 path. Check `pageerror` events and non-blank body text.
