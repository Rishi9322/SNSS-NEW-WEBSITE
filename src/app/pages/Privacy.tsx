import { Link } from "react-router";
import { Container, PageHeader } from "../components/kit";
import { useSEO } from "../hooks/useSEO";

const SECTIONS = [
              {
                title: "1. Who We Are",
                body: "Sentinel IFM Pvt. Ltd. (CIN: U74999MH2019PTC323363) is the data controller for information collected through sentinelifm.com. Our registered office is at 409, Sej Plaza, Marve Road, Malad (W), Mumbai – 400064, Maharashtra, India.",
              },
              {
                title: "2. Information We Collect",
                body: "We collect information you voluntarily provide through our contact and careers forms: name, company name, email address, phone number, city, and the nature of your enquiry. We do not collect sensitive personal data. We use server-side rate limiting and honeypot fields to prevent automated submissions.",
              },
              {
                title: "3. How We Use Your Information",
                body: "Information submitted via the quote form is used solely to respond to your facility management enquiry and to send you an auto-reply confirmation. Information submitted via the careers form is used to evaluate your application. We do not use your information for marketing without your explicit consent.",
              },
              {
                title: "4. Data Retention",
                body: "Enquiry data is retained for a maximum of 12 months from the date of submission. Careers applications are retained for 6 months. After these periods, data is securely deleted.",
              },
              {
                title: "5. Data Sharing",
                body: "We do not sell, rent, or share your personal data with third parties, except where required by law or by a court of competent jurisdiction in India. Our SMTP provider (used to deliver form emails) processes data solely for message delivery and does not retain or use it for any other purpose.",
              },
              {
                title: "6. Your Rights (DPDP Act 2023)",
                body: "Under the Digital Personal Data Protection Act, 2023, you have the right to: (a) access your personal data held by us; (b) correct inaccurate data; (c) withdraw consent and request erasure of your data. To exercise any of these rights, contact us at info@sentinelifm.com with the subject line 'Data Rights Request'.",
              },
              {
                title: "7. Cookies",
                body: "This website uses Google Analytics 4 to understand how visitors interact with the site. GA4 uses cookies. No personally identifiable information is passed to Google Analytics. You may opt out using the Google Analytics opt-out browser add-on.",
              },
              {
                title: "8. Security",
                body: "All data is transmitted over HTTPS (TLS 1.2+). Credentials and API keys are stored in environment variables and never committed to code. We do not store form submissions in a database — they are delivered directly to a monitored email inbox.",
              },
              {
                title: "9. Contact",
                body: "For privacy-related queries, write to info@sentinelifm.com with the subject line 'Privacy Query'. We will respond within 10 business days.",
              },
];

export function Privacy() {
  useSEO({ title: "Privacy Policy | Sentinel IFM", description: "Privacy policy for Sentinel IFM Pvt. Ltd.", path: "/privacy" });
  return (
    <>
      <PageHeader path={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]} title="Privacy Policy" lede="Last updated: 12 June 2026" />
      <section className="bg-white py-14 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
          <nav aria-label="Contents" className="hidden self-start lg:sticky lg:top-24 lg:block">
            <p className="display mb-3 text-lg text-ink">Contents</p>
            <ol className="border-t-2 border-ink">
              {SECTIONS.map((s, i) => (
                <li key={s.title} className="border-b border-ink/20">
                  <a href={`#s-${i + 1}`} className="block py-2 text-[15px] text-steel underline-offset-4 hover:text-ink hover:underline">{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-[68ch]">
            {SECTIONS.map((section, i) => (
              <div key={section.title} id={`s-${i + 1}`} className="mb-10 scroll-mt-24">
                <h2 className="display mb-3 text-[clamp(1.5rem,2.6vw,2rem)] text-ink">{section.title}</h2>
                <p className="text-[17px] leading-[1.7] text-steel">{section.body}</p>
              </div>
            ))}
            <div className="mt-12 border-t-2 border-ink pt-6">
              <Link to="/" className="inline-flex min-h-[44px] items-center font-bold text-ink underline underline-offset-4">Back to Home</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
