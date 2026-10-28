import { Link } from "react-router";
import { Container, PageHeader } from "../components/kit";
import { useSEO } from "../hooks/useSEO";
import { LEGAL_NAME } from "../site";

const SECTIONS = [
              {
                title: "1. Acceptance",
                body: "By accessing sentinelifm.com, you agree to be bound by these Terms of Service. If you do not agree, do not use this website. These terms are governed by the laws of Maharashtra, India.",
              },
              {
                title: "2. Nature of This Website",
                body: `This website is a corporate information and lead-generation website for Sentinel IFM (registered as ${LEGAL_NAME}, CIN U74999MH2019PTC323363). Submitting a quote request or career application does not constitute a binding contract. Services are provided under separately executed service agreements.`,
              },
              {
                title: "3. Accuracy of Information",
                body: "We make reasonable efforts to ensure that registration numbers, certification details, and contract records displayed on /compliance are current and accurate. However, all figures should be independently verified against official government portals (EPFO, ESIC, GeM, MCA21) before use in tender documents. Sentinel accepts no liability for decisions made on the basis of website information alone.",
              },
              {
                title: "4. Intellectual Property",
                body: `All content on this website — including text, layout, service descriptions, and company data — is the intellectual property of Sentinel IFM (registered as ${LEGAL_NAME}, CIN U74999MH2019PTC323363). Reproduction, redistribution, or commercial use of any content without written permission is prohibited.`,
              },
              {
                title: "5. Form Submissions",
                body: "By submitting a quote or careers form, you confirm that: (a) the information provided is accurate; (b) you consent to Sentinel contacting you via the email address and phone number provided; (c) you understand that submission does not guarantee service provision or employment.",
              },
              {
                title: "6. Links to Third Parties",
                body: "This website contains links to WhatsApp (wa.me) and may reference external government portals. Sentinel is not responsible for the content, privacy practices, or reliability of any third-party website.",
              },
              {
                title: "7. Limitation of Liability",
                body: `To the maximum extent permitted by applicable law, Sentinel IFM (registered as ${LEGAL_NAME}, CIN U74999MH2019PTC323363) shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or reliance on its content.`,
              },
              {
                title: "8. Governing Law",
                body: "These terms are governed by the laws of Maharashtra, India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.",
              },
              {
                title: "9. Changes to These Terms",
                body: "Sentinel reserves the right to update these Terms of Service at any time. Continued use of the website after changes constitutes acceptance of the revised terms. The 'Last updated' date at the top of this page reflects the most recent revision.",
              },
              {
                title: "10. Contact",
                body: "For queries regarding these Terms, write to info@sentinelifm.com with the subject line 'Terms Query'.",
              },
];

export function Terms() {
  useSEO({ title: "Terms of Service | Sentinel IFM", description: "Terms of service for Sentinel IFM.", path: "/terms" });
  return (
    <>
      <PageHeader path={[{ label: "Home", to: "/" }, { label: "Terms of Service" }]} title="Terms of Service" lede="Last updated: 28 October 2026" />
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
