# SNSS Global Services — Website

A responsive single-page marketing site for **SNSS Global Services Pvt. Ltd.**, an integrated facilities management company operating across Mumbai, Pune, Ahmedabad, and Bhopal. Built with React 18, Vite, and Tailwind CSS v4.

> Originally scaffolded from a Figma Make design export: https://www.figma.com/design/zDWtGHJfHPtGkYFjZN3d0s/Build-responsive-single-page-website

## Tech stack

- **Build tool:** Vite 6
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **UI primitives:** Radix UI + shadcn/ui-style components (`src/app/components/ui/`)
- **Routing:** React Router v7 (hash-based, so it works on any static host with no server rewrite rules)
- **Animation:** `motion` (Framer Motion's successor)
- **Form backend:** [Web3Forms](https://web3forms.com) — no custom backend required
- **Package manager:** pnpm (`pnpm-workspace.yaml` present)

Other notable libraries: `react-hook-form`, `recharts`, `embla-carousel-react`, `lucide-react`, `sonner`, `date-fns`. A few packages (`@mui/material`, `react-dnd`, `canvas-confetti`, `vaul`) are present from the original scaffold but not currently used by any page.

## Getting started

```bash
pnpm install
pnpm dev      # starts the Vite dev server
pnpm build    # production build to dist/
```

### Environment variables

Copy `.env.example` to `.env` and fill in the keys you need:

```
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
# Optional: for Labour Law Assist AI responses (MVP falls back to grounded mock responses)
VITE_LLM_API_KEY=your-xai-or-openai-key
```

- Web3Forms is required for the contact form.
- `VITE_LLM_API_KEY` enables real LLM-powered answers in Labour Law Assist. Without it the feature still works using the curated dataset + deterministic grounded responses.
- Never commit real keys. The `.env` file is gitignored.

## Project structure

```
src/
  app/
    routes.tsx          Route definitions (hash router)
    constants.tsx        Shared data: colors, services list, certifications, testimonials, etc.
    components/
      Layout.tsx          Header, footer, nav — wraps every page
      FadeIn.tsx           Scroll-triggered fade-in wrapper used throughout
      ui/                  Radix/shadcn-style primitives (button, dialog, select, tabs, ...)
      figma/                Figma-export image helper
    pages/
      Home.tsx              Landing page — hero, services, proof points, testimonials
      About.tsx             Company timeline, industries served, testimonials
      Services.tsx          Service catalog grid
      ServiceDetail.tsx     Individual service page (housekeeping, pantry, technical, etc.)
      Compliance.tsx        Registrations, labour compliance, ISO certs, GeM contracts
      Careers.tsx           Open roles, employee benefits, application form
      Contact.tsx           Quote request form (Web3Forms) + office locations/maps
      Privacy.tsx / Terms.tsx   Static legal pages
      NotFound.tsx          404 page
  assets/                 Logo and other bundled images
  styles/                 Tailwind entry, fonts, theme CSS
```

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About Us |
| `/services` | Services listing |
| `/services/:slug` | Service detail (6 services) |
| `/compliance` | Compliance & certifications |
| `/careers` | Careers |
| `/contact` | Contact & quote request |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/assist` | Labour Law Assist (AI chatbot for Indian labour law) |
| `*` | 404 |

## Labour Law Assist (AI Chatbot)

**Integrated feature** (MVP) added to the site at `/assist`.

- **Purpose**: Situation-specific answers to Indian labour law questions (wages, termination, leave, PF/ESI, POSH, etc.) grounded in a curated dataset.
- **Key requirements met**: Personalization via profile (state, role, sector), clarifying questions, structured responses with citations, strict guardrails (no drafting, escalate for litigation/POSH/termination, no false certainty).
- **Tech (MVP)**: Client-side only. Curated JSON dataset + simple retrieval. Optional LLM API (xAI/OpenAI) via `VITE_LLM_API_KEY`. Chat history & profile stored in localStorage.
- **Design**: Fully integrated — uses existing NAVY/AMBER palette, shadcn/ui components, Layout, motion, and typography.
- **Access**: 
  - Direct: `/#/assist`
  - Floating "Ask AI" button appears on all pages (bottom-right, next to WhatsApp).
  - Navigation link in header (after Compliance).

**Disclaimers**: Every response and the page itself carry clear "This is not legal advice" language. Users are directed to consult qualified lawyers for their situations. Dataset last updated June 2026 (manual curation).

**Development notes**:
- Full implementation plan and decisions: `.kilo/plans/labour-law-assist-mvp.md`
- Dataset lives at `src/data/labour-law-dataset.json`
- To enable real LLM responses: add key to `.env` (see below). MVP works with mock/grounded responses even without key.
- Future phases (documented in plan): real auth, vector DB (Supabase), admin dataset tools, Next.js migration.

## Deployment

The app builds to static files (`dist/`) and can be hosted anywhere — Vercel, Netlify, or any static file host. Since routing is hash-based (`/#/contact` rather than `/contact`), no server-side rewrite configuration is needed for deep links to work.

## Other files

- `src/imports/` — Original product requirement docs (PRD, TRS, handover notes) carried over from the design handoff.
- `ATTRIBUTIONS.md` — Credits for shadcn/ui and stock photography used in the design.
- `guidelines/` — Design/dev guidelines from the original Figma Make export.
