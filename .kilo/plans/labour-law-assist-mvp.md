# Labour Law Assist MVP — Integration Plan with Existing SNSS Site

**Project:** Seamlessly integrate Labour Law Assist AI Chatbot into the current SNSS Global Services marketing website
**Plan File:** .kilo/plans/labour-law-assist-mvp.md
**Status:** Updated — Integration-first approach
**Date:** 2026-06-18

## Updated Executive Summary (per user feedback)
The user explicitly wants the Labour Law Assist chatbot **integrated into the existing site** rather than a standalone experience. 

**Integration Strategy (chosen default, documented here):**
- Add "Labour Law Assist" as a first-class navigation item in both desktop and mobile menus (after "Compliance").
- Create `/assist` route that uses the exact same layout, color scheme (NAVY #0F2A4A + AMBER #E8871A), typography, and component library as the rest of the site.
- Position the tool as a **client value-add from SNSS** — "Free AI Labour Law Assistant built on SNSS's 25+ years of compliance expertise".
- Add a floating "Ask AI" button (similar to the existing WhatsApp FAB) on all pages that opens a compact version of the chatbot.
- Cross-promote SNSS services (payroll, staffing, compliance) within chatbot responses and on the assist landing page.
- Reuse existing UI primitives (shadcn/ui components already in the project).

This turns the marketing site into a product-led growth asset. The chatbot becomes a lead magnet for HR/facility managers who interact with it and then request quotes.

**Key Agent Discretion Decisions:**
- **Stack:** Stay 100% within current Vite + React + TypeScript + Tailwind + shadcn/ui. No new frameworks.
- **Backend:** For true MVP, use client-side only (localStorage for history, static JSON dataset). LLM calls via `fetch` to a public API key (xAI Grok or OpenAI). Recommend migrating to Next.js + Supabase in Phase 2 for auth, persistence, and proper RAG.
- **Auth:** Skip full auth in MVP. Use anonymous sessions with optional "Save History" that uses localStorage. Profile (state, role) saved in localStorage and pre-filled.
- **RAG:** Curated `labour-law-dataset.json` (20-30 high-quality structured entries covering all PRD acts + 4 Labour Codes with state implementation metadata). Simple keyword + embedding similarity (using `natural` or `ml-distance` if added, else basic TF-IDF).
- **LLM:** System prompt strictly follows Appendix A + retrieved chunks. Secondary guardrail pass using same LLM or rule-based checks.
- **Design:** Match existing site exactly — navy hero, amber accents, clean cards, motion animations via `motion`.

## Revised MVP Scope (Integrated)
- Update `Layout.tsx` to include new nav link: `{ label: "Labour Law Assist", to: "/assist" }`
- New page `src/app/pages/LabourLawAssist.tsx` with:
  - Hero section explaining the tool + strong disclaimers
  - Sidebar (history + profile) + main chat area (using existing `ScrollArea`, `Card`, etc.)
  - Structured response format enforced
  - Clarifying question flow
  - Feedback mechanism
- Floating action button on all pages (via Layout) that opens mini-chat
- Static dataset + retrieval logic
- Full guardrails (scope filter, no drafting, escalation triggers, hedging, citations required)
- Local chat persistence + export option
- "Talk to SNSS Expert" CTA that links to /contact with pre-filled context

**Out of scope for this MVP:** Real user accounts, vector DB, admin CMS, production LLM proxy, multi-language.

## Updated Implementation Steps

### 1. Planning & Setup (Read-only phase)
- [x] Finalize this integration-focused plan
- Add section to README.md describing the new feature and how it ties into SNSS compliance services

### 2. Integration Foundation
- Update navigation in `Layout.tsx` (desktop + mobile)
- Add floating "Ask AI" button in Layout (consistent with WhatsApp button)
- Create `src/data/labour-law-dataset.json` (structured chunks from PRD acts + current LABOUR_COMPLIANCE data)
- Extend `constants.tsx` with labour-law specific constants and disclaimers

### 3. Core Chat Interface
- Build `LabourLawAssist.tsx` matching site aesthetic
- Implement `ChatMessage`, `ChatInput`, `SourcesList` components using existing UI library
- Profile form (state, role = employee/employer, sector) saved to localStorage
- Multi-turn context + clarifying questions logic

### 4. Intelligence & Guardrails
- `src/lib/rag.ts` — dataset loader + simple retrieval
- `src/lib/prompts.ts` — base system prompt (adapted from Appendix A) + RAG injection
- `src/lib/guardrails.ts` — pre- and post-response checks
- Mock LLM client (replaceable with real API call)

### 5. Polish & Compliance
- Add prominent "Not legal advice — for informational purposes only" on every response and page
- DPDP-style consent banner on first visit
- Thumbs feedback stored locally
- Auto-generated chat titles
- "Escalate to SNSS Labour Expert" button linking to contact with context
- Full accessibility and responsive behavior

### 6. Verification
- Test 15+ realistic Indian labour queries (termination in Maharashtra for 15-employee company, POSH complaint, gratuity eligibility, etc.)
- Confirm every substantive response cites a dataset source
- Zero guardrail violations in test suite
- Run `pnpm dev`, verify navigation, floating button, chat flow, and design consistency
- Update ATTRIBUTIONS.md if new libraries added

## Success Criteria for Integration
- Chatbot feels like a native part of the SNSS website (same fonts, colors, motion, layout patterns)
- Navigation update makes it discoverable from every page
- Floating button provides instant access without leaving current page
- Responses reinforce SNSS as the trusted compliance partner
- Maintains existing site performance and build process

## Risks & Mitigations (Updated)
- **Legal exposure** — Heavy disclaimers, strict guardrails, "consult qualified lawyer" triggers, link to SNSS compliance services instead of giving advice.
- **Design inconsistency** — Strict adherence to existing `constants.tsx` colors, `Layout.tsx` patterns, and shadcn components.
- **LLM cost/latency** — Start with mock responses + local dataset; add real API only after testing.
- **Maintenance** — Keep dataset in JSON; document update process clearly in README.

This revised plan prioritizes deep integration with the existing site as requested. The chatbot becomes a powerful extension of SNSS's labour compliance offering.

**Ready for implementation.** All choices documented. No source files will be edited until plan_exit is confirmed by user or explicitly allowed.
