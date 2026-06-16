import { useEffect } from "react";
import { Link } from "react-router";
import { NAVY, AMBER } from "../constants";

export function Privacy() {
  useEffect(() => { document.title = "Privacy Policy | SNSS Global Services"; }, []);
  return (
    <>
      <div className="py-14" style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(232,135,26,0.8)" }}>
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span className="mx-2 opacity-40">/</span>Privacy Policy
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}>Privacy Policy</h1>
          <p className="text-white/55 text-sm mt-2">Last updated: 12 June 2026</p>
        </div>
      </div>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="prose prose-sm max-w-none" style={{ color: "#4a5a6a" }}>
            {[
              {
                title: "1. Who We Are",
                body: "SNSS Global Services Pvt. Ltd. (CIN: U74999MH2019PTC323363) is the data controller for information collected through www.snssgroup.com. Our registered office is at 409, Sej Plaza, Marve Road, Malad (W), Mumbai – 400064, Maharashtra, India.",
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
                body: "Under the Digital Personal Data Protection Act, 2023, you have the right to: (a) access your personal data held by us; (b) correct inaccurate data; (c) withdraw consent and request erasure of your data. To exercise any of these rights, contact us at INFO@SNSSGROUP.COM with the subject line 'Data Rights Request'.",
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
                body: "For privacy-related queries, write to INFO@SNSSGROUP.COM with the subject line 'Privacy Query'. We will respond within 10 business days.",
              },
            ].map((section) => (
              <div key={section.title} className="mb-8">
                <h2 className="font-bold mb-2" style={{ color: NAVY, fontSize: "1rem" }}>{section.title}</h2>
                <p className="leading-relaxed text-sm">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t" style={{ borderColor: "rgba(15,42,74,0.1)" }}>
            <Link to="/" className="text-sm font-semibold flex items-center gap-1.5 transition-all hover:gap-2" style={{ color: AMBER }}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M13 8H3M8 3l-5 5 5 5" /></svg>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
