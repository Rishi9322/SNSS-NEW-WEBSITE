# Technical Requirements Specification (TRS)
## SNSS Global Services — Corporate Website

| Field | Detail |
|---|---|
| **Version** | 4.0 — Final |
| **Date** | June 12, 2026 |
| **Companion Document** | PRD v4.0 |
| **Domain** | www.snssgroup.com |
| **Status** | Final — Ready for Development |

> **What this document is:** The minimum technical decisions a developer needs to build this site correctly. 10 pages, 2 forms, PDF downloads, SEO. That's the scope.

---

## 1. Stack — The Short Version

```
Next.js 15 (App Router) + TypeScript + Tailwind CSS
Hosted on Vercel
Forms via Next.js API Routes + company SMTP
Content in JSON files (developer-managed)
GA4 + Google Search Console
No database. No CMS. No backend server.
```

---

## 2. Operational Ownership

**This section is filled out before a single line of code is written.** More website launches fail because nobody knows who owns the domain than because of any technical decision.

| Asset | Owner (Name) | Login / Access | Notes |
|---|---|---|---|
| Domain registrar (snssgroup.com) | _______________ | _______________ | Who can change DNS records |
| DNS management | _______________ | _______________ | May differ from registrar |
| Company email / SMTP | _______________ | _______________ | Needed for form delivery |
| Vercel account | _______________ | _______________ | Created by agency; handed to SNSS at launch |
| GitHub repository | _______________ | _______________ | Agency creates; SNSS gets owner access |
| Google Analytics 4 | _______________ | _______________ | Property under SNSS Google account, not agency's |
| Google Search Console | _______________ | _______________ | Same Google account as GA4 |
| UptimeRobot | _______________ | _______________ | Under SNSS email address, not agency's |

**Rules:**
- All accounts created under SNSS email addresses, not the agency's. If the agency relationship ends, SNSS must retain full access to every asset.
- The agency may have collaborator or admin access during the project; SNSS holds owner access.
- This table is completed and signed off by SNSS management before DNS cutover.

---

## 3. Why This Stack

| Need | Decision | Why |
|---|---|---|
| SEO | Next.js SSG/SSR | Pages render as HTML. Google indexes them. A React SPA would not. |
| Forms | Next.js API Routes + nodemailer | Leads go directly to SNSS inbox. No third-party branding. |
| Fast load | Static generation + Next.js Image | Pages built at deploy time; images auto-optimised. |
| Low cost | Vercel Hobby tier | Free for this traffic volume (~500–2,000 visits/month). |
| Developer availability | Next.js + TypeScript + Tailwind | Standard stack; hireable in Mumbai at normal rates. |

### What Is Not Used

| Not Used | Why |
|---|---|
| WordPress | Plugin debt; performance degrades; not owned code |
| Wix / Squarespace | No schema control; SEO ceiling |
| Google Sites | Why the PRD exists |
| React SPA | No server-rendered HTML = poor SEO |
| Database / backend | Nothing on this site requires one |

---

## 4. Content Management — The Honest Decision

This is the most consequential practical decision in the document. Make it consciously.

### The Problem

The site has content that changes regularly: GeM contracts win and close, ISO certificates renew, turnover figures update quarterly, staff headcount changes. Someone needs to update these without shipping broken code.

### Option A — Developer-Managed JSON (v1 Default)

Content lives in JSON files in the repository. A developer edits them and Vercel redeploys in ~60 seconds.

**Works well when:**
- Changes happen less than once a month
- SNSS has a developer retainer or agency relationship
- The agency is responsive to small content requests

**Breaks down when:**
- SNSS wins a GeM contract on a Friday and wants the site updated immediately
- The agency relationship changes
- Content updates pile up because raising a ticket feels heavyweight

**Cost:** ₹0 additional. Update turnaround: depends on developer availability.

### Option B — Sanity CMS (Recommended if updates are frequent)

A visual editing interface where SNSS staff update contracts, certifications, and stats directly — no code, no developer needed for content.

The JSON files in Option A map 1:1 to Sanity document types. Switching from A to B is a data-layer change; components do not change.

**Works well when:**
- SNSS expects to update content at least twice a month
- A designated content owner exists and will actually use the interface
- The ₹8,000/year cost is acceptable

**Cost:** ~₹8,000/year (Sanity Team plan). Setup: ~1 day of additional development.

### Expected Annual Update Volume

Before choosing, estimate how often content actually changes:

| Content | Expected Updates / Year | Who Triggers It |
|---|---|---|
| GeM contracts (won or ended) | 4–8 | Operations team |
| ISO certificate renewals | 1–2 | Admin |
| Turnover / headcount | 4 (quarterly) | Accounts |
| Staff count | 4 (quarterly) | HR |
| Case studies | 1–3 | MD / Sales |
| **Total** | **~15–20 / year** | **< 2 per month** |

At ~15–20 updates per year, a developer editing JSON and redeploying (60 seconds on Vercel) is completely workable — provided the developer is responsive to content requests. A CMS makes sense when SNSS needs to make those updates independently, without raising a ticket.

### Decision Required Before Build Starts

> **[ ] Option A — Developer-managed JSON** *(recommended if developer retainer exists)*
> **[ ] Option B — Sanity CMS from day one** *(recommended if SNSS needs editorial independence)*

If Option A is chosen and it becomes a bottleneck — the most likely trigger is "we won a GeM contract and the developer isn't available" — switching to Option B is a 1-day migration, not a rebuild.

---

## 5. Folder Structure

```
snss-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Nav, footer, GA4 script
│   │   ├── page.tsx                # /
│   │   ├── about/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── compliance/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx     # v1: 6 service pages
│   │   ├── industries/             # v2: industry-specific landing pages
│   │   │   ├── page.tsx            # (not built in v1 — architecture placeholder only)
│   │   │   └── [slug]/page.tsx     # /industries/hospitals, /industries/manufacturing, etc.
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── api/
│   │       ├── contact/route.ts
│   │       └── careers/route.ts
│   │
│   ├── components/
│   │   ├── layout/                 # Header, Footer, TopBar, MobileMenu
│   │   ├── ui/                     # shadcn/ui base components
│   │   ├── forms/                  # ContactForm, CareersForm
│   │   ├── cards/                  # ServiceCard, CertCard, CaseStudyCard
│   │   └── sections/               # HeroSection, ProofStrip, CtaBand, etc.
│   │
│   ├── data/                       # JSON content files (Option A) or Sanity client (Option B)
│   │   ├── metrics.json
│   │   ├── contracts.json
│   │   ├── certifications.json
│   │   ├── registrations.json
│   │   └── services.json
│   │
│   └── lib/
│       ├── mail.ts                 # nodemailer
│       ├── seo.ts                  # Shared metadata helpers
│       └── analytics.ts            # GA4 event tracking
│
├── public/
│   ├── images/                     # All site images (WebP)
│   ├── docs/                       # ISO certificate PDFs
│   └── logos/                      # Client logos
│
├── .env.local                      # Never committed to git
├── .env.example                    # Committed — documents required variables
├── vercel.json                     # Redirects + security headers
└── next.config.ts
```

---

## 6. Data Files (Option A — JSON)

Developer-edited. Vercel redeploys on push to `main`. All figures must match the verified numbers in PRD Section 14.1 before launch.

**metrics.json**
```json
{
  "foundedYear": 1999,
  "staffCount": "700+",
  "turnover": "₹55 Cr+",
  "states": 7,
  "isoCertCount": 6,
  "gemTotal": "₹2.04 Cr+",
  "lastVerified": "2026-06-12"
}
```

**contracts.json**
```json
[
  {
    "institution": "EPFO — Regional Office Thane",
    "ministry": "Ministry of Labour & Employment",
    "resources": 20,
    "value": "₹74.05L",
    "bidNumber": "GEM/2023/B/3476061",
    "active": true
  }
]
```

**certifications.json**
```json
[
  {
    "standard": "ISO 9001:2015",
    "type": "QMS",
    "name": "Quality Management System",
    "scope": "Consistent, customer-focused service delivery.",
    "pdfFile": "iso-9001-2015.pdf",
    "expiryDate": "2027-03-15"
  }
]
```

**registrations.json**
```json
{
  "cin": "U74999MH2019PTC323363",
  "gst": "27ABBCS8372G1Z2",
  "pan": "ABBCS8372G",
  "tan": "MUMS99154G",
  "msme": "UDYAM-MH-18-0067937",
  "startup": "DIPP115148",
  "shopEstablishment": "820046054",
  "labourId": "1-2500-4153-4",
  "epfo": "KDMAL1959239000",
  "esic": "35000446310001099",
  "professionalTax": "27711691383P",
  "mlwf": "MUM89438",
  "lastVerified": "2026-06-12"
}
```

---

## 7. Forms

### 7.1 Fields

**Contact form:**

| Field | Required | Validation |
|---|---|---|
| Full Name | Yes | Min 2 chars |
| Company | No | — |
| Email | Yes | Valid email |
| Phone | Yes | 10-digit Indian mobile |
| City | Yes | — |
| Service Required | Yes | Dropdown — 7 options |
| Message | No | Max 1,000 chars |
| How did you hear | Yes | Dropdown — 5 options |
| Honeypot | — | Must be empty |

**Careers form:**

| Field | Required | Validation |
|---|---|---|
| Full Name | Yes | Min 2 chars |
| Phone | Yes | 10-digit Indian mobile |
| City | Yes | — |
| Role Applying For | Yes | Dropdown — 9 options |
| Years of Experience | Yes | Dropdown — 5 ranges |
| How did you hear | Yes | — |
| Honeypot | — | Must be empty |

### 7.2 Processing Flow (Both Forms)

```
1. Client-side validation (React Hook Form + Zod) — inline errors on blur
2. POST to /api/contact or /api/careers
3. Server validates again (Zod)
4. Honeypot check: if populated → return 200 silently (do not alert the bot)
5. Rate limit: max 5 submissions per IP per hour → 429 if exceeded
6. SMTP: send lead email to SNSS inbox
7. SMTP: send auto-reply to enquirer
8. Return 200 → show success message in place of form (no redirect)

On SMTP failure:
→ Return 500
→ Show: "Could not send. Please WhatsApp us: +91 86553 62161"
→ Show email address as fallback
```

### 7.3 Email Content

**To SNSS:**
```
Subject: New Quote Request — [Service] — [Name] — [City]

Name:      [name]
Company:   [company or "—"]
Email:     [email]
Phone:     [phone]
City:      [city]
Service:   [service]
Found via: [leadSource]
Message:   [message or "—"]
Time:      [ISO timestamp]
```

**Auto-reply to enquirer:**
```
Subject: We've received your enquiry — SNSS Global Services

Dear [name],

Thank you for contacting SNSS Global Services.

We've received your enquiry and will respond within 4 business hours.

If you need to reach us immediately:
WhatsApp: +91 86553 62161
Email: info@snssgroup.com

SNSS Global Services Pvt. Ltd.
409, Sej Plaza, Marve Road, Malad (W), Mumbai – 400064
An ISO Certified Company | Est. 1999
```

---

## 8. Email / SMTP Setup

**This is the step most likely to delay launch.** Confirm SMTP credentials in Week 1. Do not assume they will appear in Week 4.

```typescript
// lib/mail.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
```

**Supported providers:**

| Provider | SMTP Host | Notes |
|---|---|---|
| Google Workspace | smtp.gmail.com | Requires App Password if 2FA enabled |
| Microsoft 365 | smtp.office365.com | Requires App Password or OAuth2 |
| Zoho Mail | smtp.zoho.in | Common in Indian companies |

**Required environment variables:**
```bash
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@snssgroup.com
LEADS_EMAIL=leads@snssgroup.com       # Sales inbox — must be monitored
HR_EMAIL=hr@snssgroup.com             # HR inbox
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_SITE_URL=https://www.snssgroup.com
```

**SNSS action — Week 1:** Provide SMTP provider name, SMTP credentials, and confirm both inbox addresses are actively monitored. If this is not resolved in Week 1, it will delay the launch.

---

## 9. SEO

### Per-Page Metadata

Every page has a unique title (≤60 chars) and description (140–160 chars). No two pages share either.

```typescript
// Example — /services/housekeeping
export const metadata = {
  title: 'Professional Housekeeping Services in Mumbai | SNSS Global Services',
  description: 'ISO-certified housekeeping and janitorial services. 700+ trained, EPFO/ESIC-compliant staff. Mumbai, Pune, Thane and 7+ states.',
  openGraph: {
    url: 'https://www.snssgroup.com/services/housekeeping',
    images: [{ url: '/images/og/housekeeping.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.snssgroup.com/services/housekeeping' },
}
```

### Schema Markup

- Homepage: `LocalBusiness` JSON-LD
- Service pages: `Service` JSON-LD
- Injected via `<script type="application/ld+json">` in each page `<head>`

### Sitemap & Robots

Auto-generated by Next.js App Router. Submitted to Google Search Console at DNS cutover.

---

## 10. Industry Pages — Architecture Note (v2)

Not built in v1. Acknowledged now because the route structure affects the folder layout and sitemap, and retrofitting it later is avoidable friction.

**Why they matter:** Service pages (`/services/housekeeping`) rank for what SNSS does. Industry pages (`/industries/hospitals`) rank for who SNSS serves. A facility manager at a hospital searching "facility management for hospitals Mumbai" will convert faster from an industry page than a generic housekeeping page.

**Target industry slugs (v2):**

| Slug | Page Title | Primary Audience |
|---|---|---|
| `/industries/corporate-offices` | Facility Management for Corporate Offices | Segment 2A — Operations Head |
| `/industries/hospitals` | Facility Management for Hospitals & Healthcare | Admin / Facility Head |
| `/industries/manufacturing` | Facility Management for Manufacturing Plants | Plant Head / COO |
| `/industries/schools` | Housekeeping & Support Staff for Schools | School Admin |
| `/industries/warehouses` | Facility Staffing for Warehouses & Logistics | Operations Manager |
| `/industries/malls` | Housekeeping & Security for Shopping Malls | Facility Manager |

**v1 action:** Reserve the `/industries/` path in `vercel.json` (no redirects pointing away from it). Do not build the pages. Add `industries` to the sitemap generator's exclusion list until v2.

**v2 action:** Build 3–4 industry pages targeting the highest-volume searches. Each page follows the same template as service pages: H1 matching the search query, problem-solution content for that industry, relevant service links, quote CTA.

---

## 11. Analytics

GA4 loaded after page is interactive — does not block render.

**9 events. Implemented at launch.**

If launch is under time pressure, the first four are the non-negotiable minimum — they cover the primary revenue journey. The remaining five add diagnostic value but the site functions without them on day one.

| Event | When | Priority |
|---|---|---|
| `quote_form_submit` | Contact form successful | Must have |
| `whatsapp_click` | Any wa.me link clicked | Must have |
| `cta_click` | "Get a Quote" button (any page) | Must have |
| `careers_form_submit` | Careers form successful | Must have |
| `compliance_page_view` | /compliance loads | Should have |
| `file_download` | PDF certificate downloaded | Should have |
| `service_page_view` | Any /services/[slug] loads | Should have |
| `email_click` | Any mailto: link clicked | Nice to have |
| `how_did_you_hear` | Source dropdown value from form | Nice to have |

```typescript
// lib/analytics.ts
export function trackEvent(event: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, params)
  }
}
```

---

## 12. Monitoring & Backups

**The things most likely to actually hurt SNSS post-launch — in order of likelihood.**

### Uptime Monitoring
Set up [UptimeRobot](https://uptimerobot.com) free tier before DNS cutover. Monitors the homepage every 5 minutes. Emails SNSS admin if the site goes down. Takes 5 minutes to configure.

### Domain Renewal
- Set domain to auto-renew at the registrar
- Calendar reminder 60 days before expiry date
- If the domain expires, the website disappears. This has happened to serious companies.

### GitHub Repository
- Repository is private on GitHub under SNSS's account
- Agency has collaborator access during the project
- If the agency relationship ends, SNSS revokes collaborator access and retains the repository

### Vercel Account
- Created under an SNSS email address
- If the agency set up Vercel under their own account, transfer the project to SNSS's account before launch

### DNS Documentation
- Document: who owns the domain, which registrar, login details stored where
- Sounds obvious. Regularly the cause of launch delays and post-launch emergencies.

---

## 13. Performance

### Targets (Measured on Production With Real Content)

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Page weight | < 1.5 MB |

Lighthouse on a prototype with placeholder images is not an accepted measurement.

### Images

All images via Next.js `<Image>`. No exceptions.
- Max source file: 200 KB before optimisation
- Hero image: `priority={true}` — it is the LCP element; do not lazy-load it
- All others: lazy-loaded by default
- Alt text: descriptive on every informative image; `alt=""` on decorative images only

### Fonts

Self-hosted via `next/font/google`. Zero Google CDN request in the browser.

```typescript
import { Oswald, Inter } from 'next/font/google'
// Next.js downloads and self-hosts at build time automatically
```

### Animation Budget

Framer Motion for scroll-reveal on section entry only. If any animation causes Lighthouse Performance to drop below 90, remove the animation — not the target. No animations at all on /compliance.

---

## 14. Security

Proportionate to the actual threat model. The real risks are: a wrong GST number on the compliance page, a broken contact form nobody notices, and the domain expiring.

**Do:**
```json
// vercel.json — security headers + 301 redirects
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]
  }],
  "redirects": [
    { "source": "/home",           "destination": "/",          "permanent": true },
    { "source": "/certifications", "destination": "/compliance","permanent": true },
    { "source": "/quotation",      "destination": "/contact",   "permanent": true },
    { "source": "/jobs",           "destination": "/careers",   "permanent": true }
  ]
}
```

- All secrets in environment variables — never in code, never committed
- `npm audit` before launch; fix critical vulnerabilities
- HTTPS enforced (Vercel handles this automatically)

**Don't:**
- Add CAPTCHA (friction for mobile users; unnecessary at this volume)
- Build auth or access control (there is nothing to protect)
- Spend more than half a day on security for v1

---

## 15. Accessibility

WCAG 2.1 AA. Build requirements, not stretch goals.

| Requirement | Implementation |
|---|---|
| Colour contrast | 4.5:1 ratio minimum for all text |
| Keyboard navigation | Every interactive element reachable and operable via keyboard |
| Focus indicators | Visible ring on all focusable elements; never `outline: none` without replacement |
| Skip link | "Skip to main content" as first DOM element |
| Alt text | Descriptive on informative images; empty on decorative |
| Form labels | Every input has an associated `<label>` |
| Heading hierarchy | H1 → H2 → H3; no levels skipped |
| Reduced motion | Framer Motion off when `prefers-reduced-motion: reduce` |

Run axe DevTools on every page before DNS cutover. Zero critical violations at launch.

---

## 16. Responsive Design

Mobile-first. Tailwind breakpoints: `sm: 360px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

Minimum physical device test before launch:
- Android phone (~360px) — Chrome
- iPhone (~390px) — Safari
- Tablet (~768px) — Safari
- Desktop (1280px) — Chrome, Firefox, Edge

Chrome DevTools device emulation is not a substitute for a physical device test.

---

## 17. /compliance Print Styles

Procurement officers print this page or save-as-PDF for tender document packs.

```css
@media print {
  header, footer, nav, .no-print { display: none !important; }
  body { background: white; color: black; font-size: 12pt; }
  table { width: 100%; border-collapse: collapse; }
  tr { page-break-inside: avoid; }
  th, td { border: 1px solid #999; padding: 6pt; }
  @page { margin: 20mm; }
}
```

Test: print /compliance to PDF in Chrome. Every table must fit on A4 without rows being cut.

---

## 18. Deployment

**Hosting:** Vercel. Connect GitHub repo. Set environment variables in Vercel dashboard.

- `main` branch → auto-deploys to www.snssgroup.com
- Feature branches → auto-deploy to preview URLs for SNSS review

**DNS Cutover — when all 15 PRD launch-gate criteria pass:**

1. SNSS admin logs in to domain registrar
2. Updates A record / CNAME to Vercel
3. Vercel issues SSL automatically (~2 min)
4. Confirm HTTPS works
5. Submit sitemap.xml to Google Search Console
6. Verify all 4 Google Sites 301 redirects return correct destinations (zero 404s)
7. Submit test form — confirm email arrives in SNSS inbox
8. Leave old Google Sites live read-only for 30 days before deleting

---

## 19. Package List

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "nodemailer": "^6.9.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/nodemailer": "^6.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

**shadcn/ui:** Copied into `/src/components/ui` — not installed as a package dependency.

---

## 20. Definition of Done

**Cannot skip — site does not launch without these:**
- [ ] Renders without broken layout at 360px and 1280px (physical device)
- [ ] Contact form submits and email arrives in SNSS inbox (live test)
- [ ] /compliance prints cleanly to A4 PDF
- [ ] No broken links (link checker run across all pages)
- [ ] GA4 `quote_form_submit` and `whatsapp_click` events fire in DebugView
- [ ] Operational Ownership table (Section 2) filled out and signed off

**Should not skip — defer only under explicit time pressure with written agreement:**
- [ ] Lighthouse ≥ 90 all four categories
- [ ] Zero axe critical accessibility violations
- [ ] All images have descriptive alt text
- [ ] Unique title and description on every page
- [ ] Schema validates in Google Rich Results Test
- [ ] All 9 GA4 events verified in DebugView
- [ ] UptimeRobot configured
- [ ] Domain set to auto-renew

---

*End of document — TRS v4.0 Final*

*Companion document: SNSS Website PRD v4.0*
*Next action: SNSS completes Section 2 (Operational Ownership) and confirms SMTP provider (Section 8) before build begins.*
