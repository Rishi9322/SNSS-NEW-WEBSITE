import { Link } from "react-router";
import { NAVY, AMBER } from "../constants";
import { useSEO } from "../hooks/useSEO";

export function Terms() {
  useSEO({ title: "Terms of Service | SNSS Global Services", description: "Terms of service for SNSS Global Services Pvt. Ltd.", path: "/terms" });
  return (
    <>
      <div className="py-14" style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(232,135,26,0.8)" }}>
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span className="mx-2 opacity-40">/</span>Terms of Service
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}>Terms of Service</h1>
          <p className="text-white/55 text-sm mt-2">Last updated: 12 June 2026</p>
        </div>
      </div>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="prose prose-sm max-w-none" style={{ color: "#4a5a6a" }}>
            {[
              {
                title: "1. Acceptance",
                body: "By accessing www.snssgroup.com, you agree to be bound by these Terms of Service. If you do not agree, do not use this website. These terms are governed by the laws of Maharashtra, India.",
              },
              {
                title: "2. Nature of This Website",
                body: "This website is a corporate information and lead-generation website for SNSS Global Services Pvt. Ltd. Submitting a quote request or career application does not constitute a binding contract. Services are provided under separately executed service agreements.",
              },
              {
                title: "3. Accuracy of Information",
                body: "We make reasonable efforts to ensure that registration numbers, certification details, and contract records displayed on /compliance are current and accurate. However, all figures should be independently verified against official government portals (EPFO, ESIC, GeM, MCA21) before use in tender documents. SNSS accepts no liability for decisions made on the basis of website information alone.",
              },
              {
                title: "4. Intellectual Property",
                body: "All content on this website — including text, layout, service descriptions, and company data — is the intellectual property of SNSS Global Services Pvt. Ltd. Reproduction, redistribution, or commercial use of any content without written permission is prohibited.",
              },
              {
                title: "5. Form Submissions",
                body: "By submitting a quote or careers form, you confirm that: (a) the information provided is accurate; (b) you consent to SNSS contacting you via the email address and phone number provided; (c) you understand that submission does not guarantee service provision or employment.",
              },
              {
                title: "6. Links to Third Parties",
                body: "This website contains links to WhatsApp (wa.me) and may reference external government portals. SNSS is not responsible for the content, privacy practices, or reliability of any third-party website.",
              },
              {
                title: "7. Limitation of Liability",
                body: "To the maximum extent permitted by applicable law, SNSS Global Services Pvt. Ltd. shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or reliance on its content.",
              },
              {
                title: "8. Governing Law",
                body: "These terms are governed by the laws of Maharashtra, India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.",
              },
              {
                title: "9. Changes to These Terms",
                body: "SNSS reserves the right to update these Terms of Service at any time. Continued use of the website after changes constitutes acceptance of the revised terms. The 'Last updated' date at the top of this page reflects the most recent revision.",
              },
              {
                title: "10. Contact",
                body: "For queries regarding these Terms, write to INFO@SNSSGROUP.COM with the subject line 'Terms Query'.",
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
