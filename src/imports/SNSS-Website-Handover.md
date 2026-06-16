# Project Handover Document
## SNSS Global Services — Corporate Website

| Field | Detail |
|---|---|
| **Version** | 1.0 |
| **Date** | June 12, 2026 |
| **Project** | SNSS Global Services Corporate Website Redesign |
| **Domain** | www.snssgroup.com |
| **Handover From** | Development Agency |
| **Handover To** | SNSS Global Services Pvt. Ltd. |
| **Status** | To be completed at project close |

---

## How to Use This Document

This document is handed to SNSS at the point the website goes live. It covers everything the company needs to operate, maintain, and update the website independently — without calling the agency for routine tasks.

Read Section 2 first. It tells you who owns what. If you only read one section, read that one.

---

## 1. Project Summary

### What Was Built

A 14-page corporate website replacing the previous Google Sites setup at www.snssgroup.com. Built with Next.js 15, hosted on Vercel, designed for three audiences: government procurement officers (via the /compliance Resource Center), corporate facility and HR managers (via service-specific pages and a working quote form), and job seekers (via the /careers page).

### Pages Delivered

| URL | Purpose |
|---|---|
| `/` | Homepage — trust narrative, segment routing |
| `/services` | Services overview |
| `/services/housekeeping` | Housekeeping & Janitorial detail page |
| `/services/pantry` | Pantry Management detail page |
| `/services/technical` | Electrical, Plumbing & Technical detail page |
| `/services/data-entry` | Data Entry & Office Support detail page |
| `/services/payroll` | Payroll Management detail page |
| `/services/staffing` | Security, Drivers & Contract Labour detail page |
| `/compliance` | Resource Center — all registrations, ISO certs, GeM contracts |
| `/about` | Company story, mission, timeline, team |
| `/careers` | Open roles, employee benefits, application form |
| `/contact` | Quote form, contact details, map |
| `/privacy` | Privacy Policy |
| `/terms` | Terms & Conditions |

### What Was Not Built (Planned for v2)

- Industry-specific landing pages (`/industries/hospitals`, `/industries/manufacturing`, etc.)
- Blog / insights section
- PDF certificate downloads on /compliance
- Sanity CMS (content is managed via JSON files by a developer)
- WhatsApp Business API integration

---

## 2. Operational Ownership

**Every account listed below must be owned by an SNSS email address before this document is signed off. If any account is currently under the agency's email, transfer it before the agency relationship concludes.**

| Asset | Owner (Name) | Login Email | Where to Access | Renewal Date |
|---|---|---|---|---|
| Domain — snssgroup.com | _______________ | _______________ | _______________ (registrar) | _______________ |
| DNS Management | _______________ | _______________ | _______________ | — |
| Vercel (hosting) | _______________ | _______________ | vercel.com | Free tier — no expiry |
| GitHub Repository | _______________ | _______________ | github.com | Free tier — no expiry |
| Google Analytics 4 | _______________ | _______________ | analytics.google.com | Free — no expiry |
| Google Search Console | _______________ | _______________ | search.google.com/search-console | Free — no expiry |
| Company Email / SMTP | _______________ | _______________ | _______________ | _______________ |
| UptimeRobot | _______________ | _______________ | uptimerobot.com | Free tier — no expiry |

### Rules

1. **Do not let the agency hold owner access** to any of these after handover. Collaborator access during active work is fine. Owner access stays with SNSS.
2. **Domain auto-renewal must be enabled.** If the domain expires, the website disappears. Set a calendar reminder 60 days before the renewal date as a backup.
3. **If you cannot locate login details for any row above**, resolve it before signing off this document. "We'll figure it out later" is how websites break 18 months after launch.

---

## 3. Access Credentials

Stored securely by SNSS. Do not store in email. Use a password manager (Bitwarden, 1Password, or equivalent).

| Credential | Where Stored | Who Has Access |
|---|---|---|
| Domain registrar login | _______________ | _______________ |
| Vercel account login | _______________ | _______________ |
| GitHub account login | _______________ | _______________ |
| Google account (GA4 + Search Console) | _______________ | _______________ |
| SMTP credentials (email sending) | Vercel environment variables | Developer only |
| UptimeRobot login | _______________ | _______________ |

**Environment variables** (SMTP host, password, GA4 ID, etc.) are stored in Vercel's dashboard under Project → Settings → Environment Variables. They are never in the code. Only someone with Vercel account access can view or change them.

---

## 4. How the Website Works (Non-Technical)

### Content

The website's text, numbers, and data live in two places:

1. **Pages** — written in code files (`.tsx`). Changing page copy requires a developer.
2. **Data files** — JSON files in the `/src/data/` folder. These hold the numbers that change regularly: staff count, turnover, GeM contracts, ISO certifications, registration numbers. A developer edits these files and Vercel redeploys the site automatically in ~60 seconds.

### Forms

When someone submits the quote form or careers form on the website:
1. An email is sent to the designated SNSS inbox (`leads@snssgroup.com` / `hr@snssgroup.com`)
2. An auto-reply is sent to the person who submitted
3. The submission is tracked in Google Analytics 4

No submissions are stored in a database. If the email does not arrive, check the SMTP credentials in Vercel (Section 3) and the spam folder of the designated inbox.

### Hosting

The website is hosted on Vercel. Vercel is connected to the GitHub repository. When a developer pushes code to the `main` branch, Vercel automatically deploys the update to www.snssgroup.com within 2–3 minutes. No manual FTP, no server access required.

---

## 5. Routine Maintenance Tasks

These tasks do not require the agency. They require one person at SNSS with access to the relevant accounts.

### 5.1 Updating a Number (Turnover, Staff Count, GeM Contract)

**Who does it:** Developer (or agency on retainer)
**How long it takes:** ~15 minutes including testing

1. Open the GitHub repository
2. Edit the relevant file in `/src/data/` (e.g., `contracts.json` for a new GeM contract)
3. Update the `"lastVerified"` date in `registrations.json`
4. Commit and push to `main`
5. Vercel deploys automatically — check the live site within 3 minutes

**Files and what they control:**

| File | What It Controls |
|---|---|
| `metrics.json` | Staff count, turnover, states, ISO cert count, GeM total on homepage |
| `contracts.json` | GeM contracts table on /compliance |
| `certifications.json` | ISO certification cards on /compliance (including expiry dates) |
| `registrations.json` | All registration numbers on /compliance and footer |
| `services.json` | Service card metadata (not the full service page copy) |

### 5.2 Adding a PDF Certificate to /compliance

1. Rename the PDF file cleanly (e.g., `iso-9001-2015.pdf`)
2. Upload to the `/public/docs/` folder in the GitHub repository
3. Update the `"pdfFile"` field in `certifications.json` to match the filename
4. Commit and push — Vercel deploys automatically

### 5.3 Adding or Removing a Client Logo

1. Export the logo as PNG or SVG, name it clearly (e.g., `client-epfo.png`)
2. Upload to `/public/logos/` in the GitHub repository
3. Ask the developer to add or remove it from the client logo component
4. Commit and push

**Reminder:** Written permission from the client must be on file before any logo is displayed publicly.

### 5.4 Checking the Site is Working

UptimeRobot monitors the homepage every 5 minutes and sends an email alert if it goes down. No action needed unless an alert arrives.

To manually verify forms are working: submit a test enquiry from the /contact page and confirm the email arrives in `leads@snssgroup.com` within 2 minutes.

---

## 6. Quarterly Maintenance Checklist

Run this every three months. Takes ~30 minutes. Assign it to a named person.

**Content accuracy (SNSS Accounts + Operations):**
- [ ] Turnover figure in `metrics.json` — is it current?
- [ ] Staff headcount — is it current?
- [ ] GeM contracts table — any new contracts won? Any completed or expired?
- [ ] ISO certificate expiry dates in `certifications.json` — any approaching within 6 months?
- [ ] Registration numbers — any changes?
- [ ] Update `"lastVerified"` date in `registrations.json` after any review

**Technical (Developer or agency):**
- [ ] Run `npm audit` in the repository — fix any critical vulnerabilities
- [ ] Check Google Analytics — is data still flowing? Any unusual drop in form submissions?
- [ ] Check Google Search Console — any crawl errors or manual actions?
- [ ] Confirm UptimeRobot is still active and alerts are going to a monitored email
- [ ] Confirm domain auto-renewal is still enabled

**Print test:**
- [ ] Print /compliance to PDF in Chrome — confirm it still renders cleanly to A4

---

## 7. Event-Triggered Updates

These updates must happen within the timeframes below. They do not wait for the quarterly cycle.

| Trigger | Action Required | SLA | Owner |
|---|---|---|---|
| New GeM contract awarded | Add to `contracts.json`; update GeM total in `metrics.json` | 5 business days | SNSS Operations |
| GeM contract ended or completed | Mark as inactive in `contracts.json` or remove | 5 business days | SNSS Operations |
| ISO certificate renewed | Replace PDF in `/public/docs/`; update expiry date in `certifications.json` | 5 business days | SNSS Admin |
| ISO certificate approaching expiry | Flag for renewal | 60 days before expiry | SNSS Admin |
| Any registration number changes | Update `registrations.json` and footer | Same day | SNSS Admin |
| Leadership team change | Update /about page copy | 30 days | SNSS Admin |
| New client logo permission received | Add to logo strip | Next deploy | SNSS Marketing |
| SMTP credentials change | Update Vercel environment variables | Same day | Developer |

---

## 8. Google Analytics — Reading the Data

Log in to [analytics.google.com](https://analytics.google.com) with the SNSS Google account.

**The five numbers that matter most:**

| Metric | Where to Find It | What It Tells You |
|---|---|---|
| Quote form submissions | Reports → Events → `quote_form_submit` | How many qualified leads the site is generating |
| WhatsApp clicks | Reports → Events → `whatsapp_click` | How many people prefer direct contact |
| Compliance page visits | Reports → Pages → `/compliance` | How many procurement officers are evaluating SNSS |
| Organic search traffic | Reports → Acquisition → Organic Search | Whether SEO is working |
| Top landing pages | Reports → Pages → Landing page | Which pages people arrive on first |

**Monthly review (15 minutes):**
1. Check `quote_form_submit` — is the volume growing month on month?
2. Check top organic search landing pages — which service or compliance pages are being found?
3. Compare `quote_form_submit` vs actual contracts won (tracked manually by sales) — what is the conversion rate?

---

## 9. Google Search Console

Log in to [search.google.com/search-console](https://search.google.com/search-console) with the SNSS Google account.

**Check monthly:**
- **Coverage report** — any pages marked as errors or excluded unexpectedly?
- **Performance report** — which queries are bringing people to the site? Is the click volume growing?
- **Core Web Vitals** — any pages flagged as Poor or Needs Improvement?

If Search Console shows a manual action or security issue, contact the developer immediately.

---

## 10. Lead Response Process

The website generates the enquiry. SNSS converts it. Without this process, the website produces leads that go nowhere.

| Step | Action | SLA | Owner |
|---|---|---|---|
| 1 | Enquiry received in `leads@snssgroup.com` | — | System (auto) |
| 2 | Lead reviewed and qualified | Within 4 business hours | _______________ (named person) |
| 3 | First contact — call or WhatsApp | Within 4 business hours | _______________ (named person) |
| 4 | Site visit or detailed brief | Within 48 hours | _______________ (named person) |
| 5 | Quotation sent | Within 5 business days | _______________ (named person) |
| 6 | Outcome recorded | — | Manual log or spreadsheet |

**Backup owner for lead response (for leave / holiday cover):** _______________

**If the `leads@snssgroup.com` inbox is not monitored on a business day**, configure an out-of-office auto-reply so enquirers know when to expect a response.

---

## 11. Content Ownership

One named person is responsible for keeping the website accurate. This is not the developer. This is an SNSS employee.

**Designated content owner:** _______________

**Responsibilities:**
- Initiates all content updates listed in Sections 6 and 7
- Reviews the site quarterly using the checklist in Section 6
- Liaises with the developer (or agency on retainer) to implement updates
- Escalates any technical issues (broken pages, form failures) to the developer

**If the designated content owner leaves SNSS**, their replacement must be named and briefed before their last working day. The website does not run itself.

---

## 12. Escalation — Who to Call for What

| Problem | First Action | Escalate To |
|---|---|---|
| Quote form not sending emails | Check spam folder in `leads@snssgroup.com`; submit test form | Developer — likely an SMTP credential issue |
| Website showing an error page | Check UptimeRobot alert; log in to Vercel and check deployment status | Developer |
| Wrong number on /compliance | Edit the relevant JSON file and redeploy (Section 5.1) | — |
| Domain not resolving | Check DNS settings at the registrar; confirm domain hasn't expired | Developer + domain registrar support |
| Lighthouse performance dropped | Check recent deployments in Vercel — was a large image added? | Developer |
| Google Search Console manual action | Do not ignore — contact developer immediately | Developer + Google Search Console Help |
| Vercel deployment failing | Check Vercel dashboard for build error logs | Developer |
| ISO certificate showing as expired on site | Update expiry date in `certifications.json` and redeploy | Content owner + developer |

**Developer contact (agency or retainer):**
Name: _______________
Email: _______________
Phone / WhatsApp: _______________
Response SLA: _______________

---

## 13. Disaster Recovery

### If the Website Goes Down

1. Check UptimeRobot alert for the time it went down
2. Log in to [vercel.com](https://vercel.com) → Project → Deployments
3. If the last deployment failed, click "Redeploy" on the previous successful deployment
4. If Vercel is inaccessible, check [vercel-status.com](https://www.vercel-status.com) — Vercel may have an outage
5. If the domain is the issue (DNS), contact the domain registrar

### If the Contact Form Stops Working

1. Submit a test form — does the error message appear?
2. Check `leads@snssgroup.com` spam folder
3. Log in to Vercel → Project → Functions → check for errors on `/api/contact`
4. If SMTP credentials were recently changed, update the environment variables in Vercel (Settings → Environment Variables)
5. Contact the developer if steps 1–4 don't resolve it

### If the Domain Expires

This is preventable (auto-renewal, 60-day reminder). If it happens anyway:
1. Log in to the domain registrar immediately
2. Renew the domain
3. DNS propagation after renewal takes up to 24 hours — the site will be inaccessible during this time
4. Inform SNSS staff and key clients via WhatsApp/email that the website is temporarily down

### Code Backup

The GitHub repository is the backup. Every version of the site ever deployed is preserved in Git history. If a deployment goes wrong, a developer can roll back to any previous commit.

---

## 14. Future Development (v2 Roadmap)

Features not built in v1, in order of recommended priority:

| Priority | Feature | When to Build | Trigger |
|---|---|---|---|
| 1 | Industry landing pages (`/industries/[slug]`) | Month 3–6 | When organic traffic data shows which industries are searching for SNSS |
| 2 | PDF certificate downloads on /compliance | Month 2 | When ISO certificates are scanned and uploaded |
| 3 | Blog / insights section | Month 3+ | When SNSS designates a content owner who commits to publishing twice a month |
| 4 | Sanity CMS | Month 6+ | When content updates are happening more than twice a month and a developer is not always available |
| 5 | WhatsApp Business API | Month 3+ | When lead volume from WhatsApp justifies a structured workflow |
| 6 | Client testimonials on /clients | Month 2 | When written quotes from named clients are obtained |
| 7 | CRM integration | Month 6+ | When quote volume exceeds what a monitored inbox can manage |

**How to commission v2 work:** Any feature in this list should be scoped against the PRD v4.0 and TRS v4.0 documents before development begins. These documents define the architecture and the constraints. A new developer picking up v2 work should read both before writing code.

---

## 15. Document Library

All project documents are stored in the GitHub repository under `/docs/` and handed to SNSS at project close.

| Document | Version | Purpose |
|---|---|---|
| PRD — Product Requirements Document | v4.0 | What the website must achieve and why |
| TRS — Technical Requirements Specification | v4.0 | How the website is built |
| Handover Document (this document) | v1.0 | How to operate the website post-launch |
| Brand Guidelines | v1.0 | Colors, fonts, tagline, tone of voice |

---

## 16. Sign-Off

Both parties confirm the following before this document is considered complete.

### Agency Confirms

- [ ] All code committed to the GitHub repository under SNSS's account
- [ ] All environment variables set in Vercel under SNSS's account
- [ ] Agency collaborator access removed from Vercel, GitHub, GA4, and Search Console
- [ ] Vercel project transferred to SNSS's account (if originally under agency account)
- [ ] DNS cutover completed and verified
- [ ] All 15 PRD launch-gate criteria passed
- [ ] UptimeRobot configured and monitoring
- [ ] Test form submission confirmed — email received in `leads@snssgroup.com`
- [ ] This handover document delivered and walked through with SNSS

### SNSS Confirms

- [ ] Operational Ownership table (Section 2) fully completed
- [ ] All account credentials stored securely (not in email)
- [ ] Domain auto-renewal enabled
- [ ] Content owner named and briefed (Section 11)
- [ ] Lead response owner named (Section 10)
- [ ] Developer / agency retainer contact confirmed (Section 12)
- [ ] Quarterly maintenance checklist (Section 6) scheduled in calendar

---

**Agency sign-off**

Name: _______________
Date: _______________
Signature: _______________

---

**SNSS sign-off**

Name: _______________
Designation: _______________
Date: _______________
Signature: _______________

---

*End of Handover Document — v1.0*

*Questions after handover: refer to the escalation matrix in Section 12 before contacting the agency. Most issues can be resolved using Sections 5–9 without developer involvement.*
