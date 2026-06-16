# Product Requirements Document
## SNSS Global Services — Corporate Website

| Field | Detail |
|---|---|
| **Version** | 4.0 — Final |
| **Date** | June 12, 2026 |
| **Product** | SNSS Global Services Corporate Website |
| **Domain** | www.snssgroup.com |
| **Status** | Final — Ready for Build |
| **Owner** | SNSS Global Services Pvt. Ltd. |

**Changelog from v3.0**
- Resolved the government-vs-corporate civil war: private companies are the primary revenue focus; government tenders are the credibility engine
- Added Corporate Buyer Value Proposition as a first-class section
- Separated homepage narrative into two parallel proof tracks: compliance proof (for procurement) + operational reliability proof (for private buyers)
- Added "Why Clients Stay" as a differentiator separate from "Why Clients Buy"
- Added breadth-vs-depth objection handling to the differentiation narrative
- Added corporate-facing keywords to SEO strategy
- Added case study architecture (even as a placeholder for v1)
- Scoped the document back to what the agency needs to build; business process requirements moved to a separate Operations Readiness Checklist
- Revenue metric hypothesis acknowledged as a hypothesis, not a measurement
- 4-hour SLA qualified with operational prerequisites

---

## 1. The Brief

Build a fast, low-maintenance, multipage corporate website that does two things simultaneously:

**For government procurement officers:** Prove in under 60 seconds that SNSS is eligible, compliant, and financially credible — with every registration number, ISO certificate, and GeM contract record in one place.

**For corporate facility and HR managers:** Prove that SNSS removes operational headache, staffing risk, and compliance burden — and that clients who try SNSS stay with SNSS.

The codebase is low maintenance. The business behind it is intentionally high maintenance. That distinction matters and should not be confused.

---

## 2. Strategic Positioning

### 2.1 The Two-Track Revenue Model

| Track | Segment | Primary Motivation | What Closes the Deal |
|---|---|---|---|
| **Credibility engine** | Government procurement | Compliance verification | Registrations, ISO certs, GeM record, financial standing |
| **Revenue engine** | Private sector (corporate, hospital, school, mall, factory) | Operational reliability | SLAs, retention proof, replacement guarantee, one-vendor simplicity |

Government tenders validate SNSS's legitimacy to the private market. Private contracts generate the majority of sustainable revenue. The website must serve both audiences without either feeling like a secondary concern.

### 2.2 The Homepage Narrative Choice

Government buyers want proof of existence. Corporate buyers want proof of reliability. The homepage must lead with what both audiences share:

> **Trust built over 25 years of uninterrupted operation.**

Everything else — certifications for procurement officers, SLAs for corporate buyers — branches from that trunk.

---

## 3. Differentiation Narrative

### 3.1 Why Clients Buy (Acquisition)

Every serious FM competitor is ISO certified, EPFO compliant, and GST registered. Compliance is table stakes — it proves existence, not quality. SNSS's acquisition differentiators are:

- **25+ years of unbroken operation** — Founded 1999. Survived ownership changes, economic cycles, a full corporate transformation. Most local FM vendors are under a decade old.
- **Government-verified** — ₹2.04 Cr+ in active central government GeM contracts means multiple government audit teams have already cleared SNSS. That is harder to fake than any certification.
- **One vendor, complete coverage** — Housekeeping, pantry, technical, data entry, drivers, security, payroll. One contract, one point of contact, one compliance responsibility. This is not generalism — it is integration.
- **700+ staff with full statutory compliance, on day one** — Appointment letter, ID card, uniform, EPFO, ESIC, police verification — all handled before staff reaches the client's site.

### 3.2 Addressing the Breadth Objection

A sophisticated buyer will ask: *"If you do everything, are you expert at anything?"*

The answer is integration expertise, not category expertise. SNSS's value is not being the best housekeeping company in India. It is being the company that a facility manager can call for any staffing or maintenance problem at any time, with one contract and one SLA. That is worth more to an operations head than three best-in-class specialists they have to coordinate individually.

This objection must be addressed directly on the /about page and in service page copy. Not defensively — confidently.

### 3.3 Why Clients Stay (Retention — the Strongest Proof)

Acquisition differentiators are easy to claim. Retention metrics are hard to fake.

The following data points, if available from SNSS records, are more persuasive to a private-sector buyer than any certification:

- Average client relationship duration
- Contract renewal rate (%)
- Replacement turnaround time (hours from absence reported to replacement deployed)
- Average sites managed simultaneously
- Number of workers deployed annually
- Supervisor-to-worker ratio

**Action for SNSS before build:** Pull these figures from operations records. Even rough numbers ("most clients have been with us for 3+ years") are more powerful than leaving this section blank. If exact figures are unavailable, they become a v2 data collection target.

---

## 4. Corporate Buyer Value Proposition

This section is new in v4 and addresses the most underdeveloped part of previous versions.

### 4.1 The Private Sector Buying Conversation

Government buyers ask: *"Are you compliant?"*
Corporate buyers ask: *"How much headache will you remove from my life?"*

These are different conversations and require different content. The website currently tells the compliance story well. This section defines the operational reliability story.

### 4.2 Problems Corporate Clients Face

| Problem | How Common | SNSS Solution |
|---|---|---|
| Housekeeping staff absent without notice | Daily in large facilities | Replacement from bench strength — same day |
| Multiple vendors, multiple invoices, multiple compliance risks | Universal | Single integrated partner — one invoice, one SLA |
| Labour law compliance (PF, ESIC, PT) managed by client's HR | Significant overhead | Fully handled by SNSS; client has zero liability |
| New office or site needs staff immediately | Frequent for growing businesses | Ready talent pool with verified staff |
| HR/admin time wasted managing non-core staff | Universal | One SNSS account manager handles everything |
| Payroll errors, late payments, unhappy contract staff | Common with small vendors | SNSS payroll team; salary credited by 7th of every month |
| Staff disputes, union issues | High-risk in labour-intensive FM | SNSS absorbs this risk entirely |
| Seasonal scaling (events, new facilities, audits) | Regular | Flexible deployment up or down |

### 4.3 The Corporate Buyer Journey (Segment 2 Expanded)

**Segment 2A — Operations / Facility / Plant Head**
Role: Responsible for day-to-day facility operations. Judged on uptime, cleanliness, cost.
Motivation: Remove staffing unreliability from their problem set.
Converts on: Same-day replacement guarantee, supervisor structure, proven service quality.
Entry point: Google search for service + city ("housekeeping services Mumbai").
Key pages: /services/[slug] → /about → /contact

**Segment 2B — HR / Admin Manager**
Role: Manages support staff, statutory compliance, vendor relationships.
Motivation: Reduce compliance risk and admin overhead for non-core staff.
Converts on: EPFO/ESIC handling, police verification, single vendor.
Entry point: Referral, WhatsApp, or Google search ("payroll outsourcing Mumbai").
Key pages: /services/payroll → /compliance → /contact

**Segment 2C — CFO / COO (Final Approver)**
Role: Signs off on vendor contracts. Focused on cost and risk.
Motivation: Predictable cost, no hidden compliance liability, proven vendor stability.
Converts on: 25-year track record, government contract proof, turnover figures.
Entry point: Referral from Segment 2A or 2B; may visit /compliance directly.
Key pages: /compliance → /about → /contact

---

## 5. User Segments — Complete Set

### Segment 1 — Government Procurement Officer
Entry: Direct URL from bid document / GeM profile
Time to decision: < 60 seconds
Converts on: Every required registration number and certificate in one place, one click
Killed by: Any required document missing or more than 2 clicks away
Primary page: /compliance

### Segment 2 — Corporate Buyer (Operations / HR / Finance)
Entry: Google search, referral, WhatsApp
Time to decision: 2–5 minutes, 2–3 page views
Converts on: Service-specific content + operational reliability proof + working quote form + fast response
Killed by: Generic homepage; form that redirects to Google; no response after submission
Primary pages: /services/[slug], /about, /contact

### Segment 3 — Job Seeker
Entry: Job board, WhatsApp, referral
Time to decision: < 2 minutes
Converts on: Specific roles + concrete benefits + direct application
Killed by: No jobs page; vague "competitive salary" language
Primary page: /careers

---

## 6. Success Metrics

### Primary Metrics (Revenue-Linked)

| Metric | How Measured | 6-Month Target | Basis |
|---|---|---|---|
| Qualified quote submissions | GA4 `quote_form_submit` | 30 / month | Hypothesis — to be validated in Month 1 |
| Tender-related enquiries | "How did you hear?" field in form | 5 / month | Hypothesis |
| Quote-to-contract conversion | Manual tracking by SNSS sales | 20% | Industry benchmark for FM sector |
| Revenue pipeline influenced | Avg contract value × quote volume | ₹50L+ / month | Hypothesis based on above two figures |

*Note: All revenue metrics are hypotheses derived from industry benchmarks, not from SNSS historical data. They should be treated as directional targets and revised after the first 90 days of actual data.*

### Diagnostic Metrics

| Metric | GA4 Event | 6-Month Target |
|---|---|---|
| WhatsApp clicks | `whatsapp_click` | 60 / month |
| Compliance page visits | `page_view` on /compliance | 100 / month |
| Document downloads | `file_download` | 20 / month |
| Careers applications | `careers_form_submit` | 50 / month |
| Organic search clicks | Google Search Console | 500 / month |
| Service page views | `service_page_view` | 300 / month |

### What We Are Not Tracking
- Session duration (a 30-second compliance check is successful UX)
- Bounce rate in isolation (a procurement officer downloading a certificate and leaving is a conversion)
- Raw page views without outcome context

### SEO Timeline (Honest)

| Timeline | What's Achievable |
|---|---|
| Month 1–3 | Technical foundation indexed; Core Web Vitals passing; long-tail keywords begin appearing |
| Month 3–6 | Long-tail rankings ("payroll outsourcing Mumbai", "housekeeping agency Thane", "GeM facility management vendor") in top 20 |
| Month 6–12 | Long-tail terms in top 10; primary head terms ("facility management company Mumbai") begin moving with blog content |
| 12+ months | Top 10 for 3–5 primary head terms — requires consistent blog content operation |

Top-10 rankings for competitive head terms without a content operation is not achievable. Blog is a v2 commitment, not a v1 feature. SNSS management must understand this trade-off before launch.

---

## 7. Tech Stack

### Decision

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG for SEO; API routes for forms; dynamic sitemap; large Indian dev community |
| Language | TypeScript | Type safety reduces content-data bugs |
| Styling | Tailwind CSS | Fast to build; easy to hand off; no CSS architecture overhead |
| Hosting | Vercel | One-click deploys; global CDN; free SSL; preview deployments per PR |
| Forms | Next.js API Route + company SMTP | Leads go directly to SNSS inbox; no third-party branding; full control |
| Spam protection | Honeypot field + server-side rate limiting | No CAPTCHA friction |
| Analytics | GA4 + Google Search Console | Free; covers all PRD metrics |
| Content | JSON files in `/content` directory | GeM contracts, certs, stats, testimonials — editable without redeployment |
| PDF storage | `/public/docs` on Vercel | No additional service; GA4 tracks downloads |
| Images | Next.js `<Image>` (WebP, lazy, correct sizing) | Automatic optimisation |
| Schema | JSON-LD per page in `<head>` | LocalBusiness, Service, FAQPage |
| CMS (optional) | Sanity (v2 if non-technical staff update content) | Adds ~₹8,000/year; enables SNSS staff to edit without code |

### What Is Not Used and Why

| Not Used | Reason |
|---|---|
| WordPress + Elementor | Performance degrades; plugin maintenance; not a codebase SNSS owns |
| Wix / Squarespace | No schema control; no codebase ownership; SEO ceiling |
| Google Sites | The reason this PRD exists |
| React SPA (no SSR) | Kills SEO — defeats the discoverability objective |
| MERN / Laravel + MySQL | No database required; overkill for lead-generation website |

### Annual Infrastructure Cost

| Item | Cost (INR) |
|---|---|
| Vercel Hobby (sufficient for v1) | ₹0 |
| Domain renewal (snssgroup.com) | ~₹1,000 |
| Sanity CMS (v2, optional) | ~₹8,000 |
| SMTP (existing company email) | ₹0 additional |
| **Total v1** | **~₹1,000/year** |

---

## 8. Site Architecture

Eight routes. Each has a defined job and a defined primary segment.

```
/                         Homepage — trust statement + segment routing
/services                 Services overview — all 6, links to detail pages
/services/housekeeping    Housekeeping & Janitorial (SEO + conversion)
/services/pantry          Pantry Management (SEO + conversion)
/services/technical       Electrical, Plumbing & Technical (SEO + conversion)
/services/data-entry      Data Entry & Office Support (SEO + conversion)
/services/payroll         Payroll Management & Labour Compliance (SEO + conversion)
/services/staffing        Security, Drivers & Outsourced Labour (SEO + conversion)
/compliance               Resource Center — all credentials (Segment 1 primary)
/about                    Company story + differentiation + team
/careers                  Roles + benefits + application (Segment 3 primary)
/contact                  Quote form + contact details (Segment 2 primary CTA)
/privacy                  Privacy Policy (DPDP Act 2023 — legal requirement)
/terms                    Terms & Conditions (legal requirement)
```

**301 Redirects from Google Sites:**
```
/home           → /
/services       → /services
/certifications → /compliance
/quotation      → /contact
/jobs           → /careers
```

---

## 9. Page Requirements

### FR-01: Global — Navigation

- Sticky header: logo · Services (mega-dropdown) · About · Compliance · Careers · Contact · "Get a Quote" button
- Top bar (desktop): "ISO Certified · Since 1999" | WhatsApp click-to-chat | email
- Mobile: hamburger → full-width drawer; Services expands inline
- Active state on current page
- **Acceptance:** Functional at 360px; keyboard navigable; dropdown closes on outside click; all 14 routes linked correctly

---

### FR-02: Global — Footer

- Col 1: Logo + one-line description + statutory registrations (CIN, GST, MSME, Startup India — **visible, not fine print**)
- Col 2: Services (all 6 links)
- Col 3: Company (About, Compliance, Careers, Privacy, Terms)
- Col 4: Contact (address, WhatsApp, email)
- Bottom bar: copyright + "An ISO Certified Company"
- **Acceptance:** Registrations visible at default zoom; all links resolve; renders at 360px

---

### FR-03: Homepage ( / )

**One job above the fold: make any visitor feel they have landed on a credible, established, serious company.**

**Above the fold (no scroll):**
- Headline: "Facilities Management Made Professional"
- Subhead: "25 years. ISO certified. Government trusted. 700+ staff across India."
- ISO certification badge strip (visual, scannable)
- Two CTAs: "Get a Quote" (→ /contact) | "View Our Credentials" (→ /compliance)

**Scrollable sections:**

| # | Section | Content | Segment |
|---|---|---|---|
| 1 | Proof strip | 6 specific proof points — no adjectives. Examples: "25+ years unbroken operation" / "Active contracts with EPFO, SAI, Ministry of Education" / "Replacement deployed same day" | All |
| 2 | Corporate value proposition | Problem → SNSS solution table. Lead with: "We remove the staffing headache." | Segment 2 |
| 3 | Services | 6 cards → /services/[slug] | Segment 2 |
| 4 | Evidence block | GeM total (₹2.04 Cr+) · Turnover (₹55 Cr+) · States (7+) · Industries served (list) | All |
| 5 | Client logo strip | Written permission required before any logo is displayed | All |
| 6 | Case study teaser | 1–2 brief client outcomes (see FR-12) | Segment 2 |
| 7 | Quote CTA band | "We respond within 4 business hours." · "Get a Quote" | Segment 2 |
| 8 | Careers band | "Join 700+ professionals. PF, ESIC, timely wages." · Apply | Segment 3 |

**What is NOT on the homepage:**
- Full compliance table (→ /compliance)
- Full company timeline (→ /about)
- Full GeM bid numbers (→ /compliance)
- Individual management names (→ /about, subject to approval)

**Acceptance:** Above-fold < 1.5s on 4G; ISO badges visible without scroll; all 3 segment journeys reachable in ≤ 2 clicks

---

### FR-04: Services Overview ( /services )

- 1-paragraph intro: what integrated FM means and why one vendor beats three specialists
- Breadth-vs-depth objection addressed here: "Integration is the expertise."
- 6 service cards: icon, name, 2-line benefit description, industries, → detail page link
- CTA: "Not sure what you need? Talk to us." → /contact

---

### FR-05: Service Detail Pages ( /services/[slug] )

Standalone landing pages. Each ranks for its own keywords, handles its own objections, converts independently.

**Six pages:**

| Slug | H1 | Primary Keyword |
|---|---|---|
| `/services/housekeeping` | Professional Housekeeping & Janitorial Services | housekeeping services Mumbai |
| `/services/pantry` | Pantry Management & Cafeteria Staffing Services | pantry staff outsourcing Mumbai |
| `/services/technical` | Electrical, Plumbing & Technical Maintenance Services | electrical maintenance services Mumbai |
| `/services/data-entry` | Data Entry & Office Support Staffing | data entry operator staffing Mumbai |
| `/services/payroll` | Payroll Management & Labour Compliance Services | payroll outsourcing Mumbai |
| `/services/staffing` | Facility Staffing: Drivers, Security & Contract Labour | contract staffing Mumbai |

**Template per page (in order):**
1. H1 + benefit subheadline
2. What's included — specific deliverables, not category labels
3. Client benefits — operational outcomes (cost, compliance, scalability, replacement)
4. Industries served for this service specifically
5. Relevant ISO certifications
6. Case study (if available) or client outcome stat
7. Related services (2 cards)
8. CTA: "Get a quote for [service name]" → /contact with service pre-filled in dropdown

**SEO per page:** Unique title, meta description, H1, Service JSON-LD schema

---

### FR-06: Compliance — Resource Center ( /compliance )

The highest-priority page for Segment 1. Loads fast, prints clean, is never more than 2 clicks from anywhere on the site.

**Design note:** This page is a verification tool, not a marketing page. No hero image, no animations. Scannable tables, clear section headers, fast load. A "Last verified" date displayed prominently.

**Sections:**

**1. Company Registrations**

| Registration | Number |
|---|---|
| CIN | U74999MH2019PTC323363 |
| GST | 27ABBCS8372G1Z2 |
| PAN | ABBCS8372G |
| TAN | MUMS99154G |
| MSME Udyog | UDYAM-MH-18-0067937 |
| Startup India (DIPP) | DIPP115148 |
| Shop & Establishment | 820046054 |
| Labour Identification Number | 1-2500-4153-4 |

**2. Labour Compliance**

| Registration | Number |
|---|---|
| EPFO | KDMAL1959239000 |
| ESIC | 35000446310001099 |
| Professional Tax | 27711691383P |
| MLWF | MUM89438 |
| Labour Licences | Capacity: 150+ staff |

**3. ISO Certifications**
Six cards: standard, full name, scope. Each with "Download Certificate" button.
- v1: Button visible; links to PDF if available; "Certificate available on request" if not yet uploaded
- v2: All PDFs uploaded and versioned

**4. Financial Standing**
- 3-year turnover: ₹55.10 Cr *(verify against current records)*
- Annual average: ₹18.36 Cr
- Solvency Certificate: SBI, ₹1.00 Cr

**5. Government Contract Record**

| Institution | Ministry | Staff | Value |
|---|---|---|---|
| EPFO — Regional Office Thane | Labour & Employment | 20 | ₹74.05L |
| Sports Authority of India | Youth Affairs & Sports | 13 | ₹52.02L |
| Mercantile Marine Dept Mumbai | Ports, Shipping & Waterways | 9 | ₹25.49L |
| Sports Authority of India — Goa | Youth Affairs & Sports | 6 | ₹22.04L |
| KVS AFS Thane | Education | 7 | ₹21.45L |
| KVS Regional Office Mumbai | Education | 3 | ₹9.76L |
| **Total** | | **58** | **₹2.04 Cr+** |

**6. Work Completion Record**
- Sports Authority of India: 8+ years continuous service
- Shirdi Temple: ₹5.03 Cr work completion certificate
- Thermo Fisher Scientific: ₹9.83 Cr work completion certificate

**Page-level requirements:**
- "Last verified: [date]" displayed at top of page — updated every time content is changed
- CSS `@media print` styles: prints cleanly to A4, no nav/footer, tables don't break across pages
- PDF downloads tracked via GA4 `file_download`
- All tables scrollable on mobile
- **Acceptance:** All numbers signed off by SNSS Accounts before launch; print test passes; page loads < 2s

---

### FR-07: About ( /about )

**Job:** Establish that SNSS is a real, experienced organisation with deliberate leadership and a clear reason to exist — and that their breadth is a feature, not a weakness.

**Sections:**
1. Mission statement (verbatim): "To empower businesses with competent and versatile workforce solutions through cost-effective and reliable staffing services."
2. Differentiation narrative from Section 3 — specifically including breadth-vs-depth objection handling
3. Why clients stay — retention metrics (see Section 3.3; pull from SNSS ops records before build)
4. Timeline: 1999 → 2000 → 2014 → 2015 → 2019 → 2022
5. Management team *(display subject to leadership approval — Open Question 1)*
6. MSME + Startup India recognition
7. Industries served: residential complexes, offices, malls, hospitals, schools, trusts, cinemas, warehouses, factories, call centres, central and state autonomous bodies

---

### FR-08: Careers ( /careers )

**Sections:**
1. "Join 700+ professionals across India"
2. Open role categories *(SNSS HR to confirm which are actively hiring at launch)*
3. Employee benefits — specific:
   - Appointment letter on deployment
   - Photo ID card issued immediately
   - Quality uniform provided
   - Monthly payslips every month
   - Salary to bank account by the 7th of every month
   - PF deposited with EPFO
   - ESIC insurance
   - Professional Tax handled
   - Form 16 annually
   - ITR filing assistance
   - Police verification handled by SNSS
4. Application form: Name · Phone · City · Role · Experience · "How did you hear about us?"

**Acceptance:** Form submits to HR email; confirmation shown; auto-reply sent to applicant

---

### FR-09: Contact ( /contact )

**Sections:**
1. Quote form (native — not Google Forms):
   - Full Name* · Company · Email* · Phone* · City* · Service Required (dropdown, 7 options) · Message · "How did you hear about us?" (Google / Referral / GeM / Tender document / Other)
2. Response promise: "Every enquiry receives a response within 4 business hours."*
3. Contact details: address · WhatsApp click-to-chat · email
4. Single Google Maps embed (corporate office)

*Prerequisites for this promise to be kept — see Section 11 (Lead Response Process)

**Acceptance:** Form submits to designated SNSS inbox < 2 min; auto-reply to enquirer; all contact links functional on iOS and Android

---

### FR-10: Case Studies ( integrated into /about and service pages, v1 architecture )

Case studies are the single most underutilised differentiator for private-sector conversion. Government buyers want registrations. Corporate buyers want proof of delivery.

**v1 minimum (3 case studies to be written before launch):**

Each case study follows this structure:
- **Client type** (not necessarily named — "Manufacturing plant, Thane" is sufficient)
- **Challenge:** What problem did the client have before SNSS?
- **Solution:** What did SNSS deploy, specifically?
- **Result:** One or two measurable outcomes (absenteeism reduced, admin hours saved, compliance issues eliminated)

These appear as:
- A brief card on the homepage (Section 6 of homepage)
- A full block on the relevant service detail page
- A dedicated section on /about

**SNSS action required:** Identify 3 existing client relationships where an outcome story can be told. Client name can be anonymised. Written approval from the client is preferred but a composite case study is acceptable for v1.

---

### FR-11: Corporate Target Keywords (SEO Addition)

Previous versions were weighted toward government/compliance search intent. These corporate-facing terms must also be represented across service pages.

| Keyword | Target Page | Priority |
|---|---|---|
| facility management services Mumbai | / or /services | High |
| housekeeping company Mumbai | /services/housekeeping | High |
| housekeeping services for corporate offices | /services/housekeeping | Medium |
| manpower outsourcing Mumbai | /services/staffing | Medium |
| payroll outsourcing company Mumbai | /services/payroll | High |
| facility management for hospitals | /services/housekeeping or /services | Medium |
| facility management for manufacturing | /services or /about | Medium |
| contract staffing Mumbai | /services/staffing | Medium |
| GeM facility management vendor India | /compliance | Low competition — quick win |
| EPFO compliant staffing agency Mumbai | /compliance or /services/staffing | Low competition — quick win |

---

## 10. SEO Requirements

| Requirement | Specification |
|---|---|
| Page titles | Unique: `[Topic] \| SNSS Global Services` |
| Meta descriptions | 140–160 chars, benefit-led, unique per page |
| H1 | One per page, matches primary keyword |
| Schema | `LocalBusiness` (homepage), `Service` (service pages), `FAQPage` where applicable |
| Sitemap | `/sitemap.xml` auto-generated by Next.js; submitted to GSC at launch |
| Robots.txt | Valid; no accidental noindex |
| Canonicals | On all pages |
| Open Graph | Title, description, image — per page |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| Images | WebP via Next.js Image; alt text on every image; max 200KB |
| Internal linking | Service pages → /compliance + /contact; /compliance → /about; /careers → /contact |

---

## 11. Lead Response Process

This is a business operations requirement. Without it, the website generates enquiries but not revenue.

| Step | Action | SLA | Owner |
|---|---|---|---|
| 1 | Form submitted | Auto-reply to enquirer confirming receipt + 4-hour response promise | System (immediate) |
| 2 | Lead email arrives in designated inbox | — | SNSS (inbox must be monitored during business hours) |
| 3 | Lead reviewed and qualified | Within 4 business hours | Named SNSS sales owner |
| 4 | First contact: call or WhatsApp | Within 4 business hours | Named SNSS sales owner |
| 5 | Site visit or detailed brief | Within 48 hours | Named SNSS sales owner |
| 6 | Quotation sent | Within 5 business days | Named SNSS sales owner |
| 7 | Outcome recorded | — | Manual log or spreadsheet |

**Operational prerequisite for the "4-hour response" website promise:**
- A named person owns the lead inbox
- A backup person is designated for leave/holiday cover
- The inbox is monitored on all business days
- A public holiday auto-response is configured on the inbox

If these four conditions are not met before DNS cutover, the "4-hour response" copy must be removed from the website. A promise the company cannot keep is worse than no promise.

---

## 12. Analytics & Tracking

GA4 configured and verified before DNS cutover. No exceptions.

| Event | Trigger | Segment |
|---|---|---|
| `quote_form_submit` | /contact submission | 2 |
| `careers_form_submit` | /careers submission | 3 |
| `whatsapp_click` | Any wa.me link | All |
| `email_click` | Any mailto: link | All |
| `cta_click` | "Get a Quote" button (any page) | 2 |
| `compliance_page_view` | /compliance page load | 1 |
| `file_download` | PDF download | 1 |
| `service_page_view` | Any /services/[slug] load | 2 |
| `how_did_you_hear` | Form dropdown value | All |

Custom GA4 dimension: `lead_source` populated from the "How did you hear about us?" dropdown. This is the only way to know which channels drive qualified leads.

90-day review: compare `quote_form_submit` volume against actual contracts won (reported by SNSS sales). This validates or revises the revenue hypothesis from Section 6.

---

## 13. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | LCP < 2.5s; CLS < 0.1; INP < 200ms; page weight < 1.5 MB — measured on production with real content |
| Lighthouse | ≥ 90 all four categories — measured after self-hosted images and final copy |
| Responsiveness | 360px–1920px; tested on physical Android and iOS |
| Accessibility | WCAG 2.1 AA; semantic HTML5; keyboard navigable; visible focus rings; prefers-reduced-motion respected |
| Security | HTTPS enforced; HSTS; form honeypot + rate limiting; no secrets in client-side code |
| Hosting | Vercel; CI/CD from Git; preview deployments per PR; apex domain redirects to www |
| Images | Self-hosted WebP via Next.js Image; zero Google Sites CDN hot-links |
| Print | /compliance prints cleanly to A4 |
| Browser | Chrome, Safari, Firefox, Edge (last 2 versions); Android WebView; iOS Safari |

---

## 14. Content Requirements

### 14.1 SNSS Must Provide (Before Build Starts)

| Item | Risk if Missing | Deadline |
|---|---|---|
| All registration numbers re-verified | HIGH — credibility damage if wrong | Before Week 1 |
| Updated turnover + headcount (FY25-26) | HIGH — outdated figures mislead | Before Week 3 |
| Confirmed active GeM contracts | HIGH — may show ended contracts | Before Week 3 |
| ISO renewal dates confirmed, no lapsed certs | HIGH — lapsed cert on compliance page = disqualification | Before Week 1 |
| ISO certificate PDFs (scan + send) | MEDIUM — v1 can say "available on request" | Before Week 3 |
| Client logo files + written permission | MEDIUM — permissions can take weeks | Before Week 2 |
| Management team names + titles (approved for display) | MEDIUM | Before Week 2 |
| Owned service photography (not Google Sites) | MEDIUM — use stock as fallback | Before Week 2 |
| 3 case study stories (anonymised acceptable) | MEDIUM — critical for private sector conversion | Before Week 3 |
| Retention metrics (renewal rate, avg tenure) | MEDIUM — strong differentiator if available | Before Week 3 |
| Terms & Conditions (legal draft) | HIGH — legal requirement | Before Week 4 |
| Privacy Policy (DPDP Act 2023) | HIGH — legal requirement | Before Week 4 |

### 14.2 Content Governance

One named content owner. Assigned before DNS cutover. No exceptions.

| Trigger | Action | SLA |
|---|---|---|
| GeM contract won or ended | Update /compliance table | 5 business days |
| ISO certificate renewed | Replace PDF + update date on /compliance | 5 business days |
| ISO certificate approaching expiry | Flag and initiate renewal | 60 days before expiry |
| Registration number changes | Update /compliance + footer | Same day |
| Leadership change | Update /about | 30 days |
| Turnover / headcount annual update | Update homepage stats + /compliance | Quarterly |

**Designated content owner: _______________** (to be named before DNS cutover)

---

## 15. Release Plan

All pages in v1. No route deferred. Soft-launch on staging URL for internal review end of Week 3.

| Week | Deliverables | Gate (build pauses if not met) |
|---|---|---|
| **Week 1** | Homepage, /services, /contact (native form) | Registration numbers verified; SMTP/form method decided; DNS access confirmed |
| **Week 2** | All 6 service pages, /about, /careers | Service copy approved; management team display decision made |
| **Week 3** | /compliance (full), GA4, SEO meta, print styles, case studies | All /compliance numbers signed off by SNSS Accounts; at least 2 case studies written |
| **Week 4** | QA (devices + accessibility + Lighthouse), 301 redirects, DNS cutover | All 15 launch gate criteria pass; lead response owner named; content owner named |
| **Month 2** | PDF certificates on /compliance; testimonials; Sanity CMS if adopted | — |
| **Month 3** | Blog infrastructure; 4 posts targeting long-tail keywords; WhatsApp Business API | SNSS designates blog content owner |

---

## 16. Launch Gate — 15 Criteria

DNS cutover only when all 15 pass.

1. All routes render correctly at 360px, 768px, 1280px on real devices
2. Lighthouse ≥ 90 on all four categories — on production content
3. All numbers on /compliance verified and signed off by SNSS Accounts in writing
4. No ISO certificate is expired or within 30 days of expiry
5. Quote form delivers email to designated SNSS inbox < 2 minutes; auto-reply sent
6. Careers form delivers email to SNSS HR; on-screen confirmation shown
7. Every client logo displayed has written permission on file
8. /compliance prints cleanly to A4 (PDF test passes)
9. GA4: all 9 events verified in DebugView before cutover
10. Google Search Console verified; sitemap.xml submitted and crawled
11. All 5 Google Sites 301 redirects return correct destination (zero 404s)
12. All images self-hosted; zero hot-links to Google Sites CDN
13. Terms & Conditions and Privacy Policy live with legal-reviewed text
14. "Last verified" date on /compliance is current
15. Lead response owner named, confirmed, and inbox tested; content owner named

---

## 17. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Registration numbers from 2023 PPT are outdated | High | Tender disqualification | Gate criterion 3: Accounts sign-off mandatory |
| ISO certificate lapsed since 2023 | Medium | Disqualification, credibility damage | Verify all renewal dates before Week 1 |
| Active GeM contracts in PPT have since ended | High | Inflated claims | Confirm with Operations before /compliance is built |
| Client logo permission delays | Medium | Logo strip delayed | Start permissions Week 1; no logo goes live without file |
| SNSS content not delivered — build stalls | High | Launch delay | Content deadlines in release plan; build pauses formally |
| No one updates site post-launch | Very High | Site becomes a liability within 6 months | Named content owner is a launch gate criterion, not an afterthought |
| Lead response SLA not operationalised | High | Enquiries generated but not converted | Lead process tested before DNS cutover; 4-hour copy removed if process not ready |
| SEO expectations misaligned | Medium | Stakeholder disappointment | Communicate 12-month timeline for head terms at project kickoff, in writing |
| Breadth objection not handled in copy | Medium | Lost enterprise deals | Objection addressed explicitly on /services and /about |

---

## 18. Open Questions — Decisions Needed Before Build

| # | Question | Deadline | Owner |
|---|---|---|---|
| 1 | Management team publicly displayed on /about? | Before Week 2 | SNSS Directors |
| 2 | GeM bid numbers verbatim, or summarised as "₹2 Cr+ in active government contracts"? | Before Week 3 | SNSS MD / Legal |
| 3 | Who controls snssgroup.com DNS? Access needed Week 4. | Before Week 1 | SNSS Admin |
| 4 | FY25-26 turnover and headcount available? | Before Week 3 | SNSS Accounts |
| 5 | Photography budget for owned service images? | Before Week 1 | SNSS MD |
| 6 | Form delivery: company SMTP or Formspree Pro (~₹8,000/year)? | Before Week 1 | SNSS IT |
| 7 | All ISO certificates scanned and renewal dates confirmed not lapsed? | Before Week 1 | SNSS Admin |
| 8 | Sanity CMS for non-technical content updates: yes or no? | Before Week 1 | SNSS MD |
| 9 | Named content owner for post-launch updates? | Before DNS cutover | SNSS MD |
| 10 | Which careers roles are actively hiring at launch? | Before Week 2 | SNSS HR |
| 11 | Retention metrics available (renewal rate, avg client tenure, replacement time)? | Before Week 3 | SNSS Operations |
| 12 | 3 case study clients identified and approved for storytelling (anonymised acceptable)? | Before Week 3 | SNSS Sales / MD |

---

*End of document — v4.0 Final*

*Next action: SNSS management to answer Open Questions 3, 5, 6, 8 before build begins. All other questions answered by end of Week 1.*

*This document governs the build. Changes after Week 2 are scope changes and require written approval from SNSS MD.*
