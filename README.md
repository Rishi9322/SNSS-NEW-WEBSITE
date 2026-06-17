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

Copy `.env.example` to `.env` and fill in your own [Web3Forms](https://web3forms.com) access key (free, no account required — just enter an email to get a key):

```
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
```

The contact form on `/contact` posts directly to Web3Forms' API from the browser — there's no server-side code involved, so this is the only setup step needed for enquiries to start arriving by email.

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
| `*` | 404 |

## Deployment

The app builds to static files (`dist/`) and can be hosted anywhere — Vercel, Netlify, or any static file host. Since routing is hash-based (`/#/contact` rather than `/contact`), no server-side rewrite configuration is needed for deep links to work.

## Other files

- `src/imports/` — Original product requirement docs (PRD, TRS, handover notes) carried over from the design handoff.
- `ATTRIBUTIONS.md` — Credits for shadcn/ui and stock photography used in the design.
- `guidelines/` — Design/dev guidelines from the original Figma Make export.
