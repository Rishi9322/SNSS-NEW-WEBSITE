import { Container, CtaBand, PageHeader, SectionTitle } from "../components/kit";
import { REGISTRATIONS, LABOUR_COMPLIANCE, GEM_CONTRACTS, ISO_CERTS } from "../constants";
import { useSEO } from "../hooks/useSEO";
import complianceHeroImage from "../../assets/images/compliance-hero.webp";

function KeyValue({ rows, head }: { rows: { label: string; value: string }[]; head: [string, string] }) {
  return (
    <table className="w-full border-t-2 border-ink text-left">
      <caption className="sr-only">{head[0]} and {head[1]}</caption>
      <thead className="sr-only"><tr><th scope="col">{head[0]}</th><th scope="col">{head[1]}</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="block border-b border-ink/20 py-3 sm:table-row sm:py-0">
            <th scope="row" className="block pr-6 text-[16px] font-bold text-ink sm:table-cell sm:w-[40%] sm:py-4 sm:align-top">{r.label}</th>
            <td className="block break-words text-[16px] tabular-nums text-steel sm:table-cell sm:py-4">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const COMPLETIONS = [
  { org: "Sports Authority of India", note: "8+ years continuous service" },
  { org: "Shirdi Saibaba Trust", note: "₹5.03 Cr work completion certificate" },
  { org: "Thermo Fisher Scientific", note: "₹9.83 Cr work completion certificate" },
];

const FINANCIALS = [
  { label: "3-Year Turnover", value: "₹55.10 Cr", note: "Verify against current FY25-26 records" },
  { label: "Annual Average", value: "₹18.36 Cr", note: "Based on 3-year consolidated turnover" },
  { label: "Solvency Certificate", value: "₹1.00 Cr", note: "Issued by State Bank of India" },
];

export function Compliance() {
  useSEO({
    title: "Compliance Resource Centre — ISO Certs, GeM Contracts & Registrations",
    description: "View Sentinel IFM' full compliance credentials: ISO 9001/14001/45001/27001 certifications, EPFO/ESIC registrations, GeM contract history, GST, MSME Udyam, and DIPP Startup India.",
    path: "/compliance",
  });

  return (
    <>
      <PageHeader
        path={[{ label: "Home", to: "/" }, { label: "Compliance" }]}
        title="Every credential. One place."
        lede="For procurement officers: all registration numbers, ISO certifications, GeM contracts, and financial standing — verified and ready."
        image={complianceHeroImage}
        imageRatio={1600 / 900}
      >
        <p className="mt-6 text-[15px] font-bold text-white">Last verified: 12 June 2026</p>
      </PageHeader>

      <nav aria-label="On this page" className="border-b-2 border-ink bg-white">
        <Container>
          <div className="flex items-center gap-3 overflow-x-auto py-3">
            <span className="shrink-0 text-[15px] font-bold text-ink">On this page</span>
            {[["registrations", "Company registrations"], ["labour", "Labour compliance"], ["iso", "ISO certifications"], ["gem", "GeM contracts"], ["financial", "Financial standing"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="inline-flex min-h-[44px] shrink-0 items-center border-2 border-ink px-4 text-[15px] font-bold text-ink hover:bg-hivis">{label}</a>
            ))}
          </div>
        </Container>
      </nav>

      <section id="registrations" className="bg-white py-16 lg:py-20 scroll-mt-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionTitle title="Company registrations" />
          <KeyValue rows={REGISTRATIONS} head={["Registration", "Number"]} />
        </Container>
      </section>

      <section id="labour" className="bg-concrete py-16 lg:py-20 scroll-mt-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionTitle title="Labour compliance" />
          <KeyValue rows={LABOUR_COMPLIANCE} head={["Registration", "Number"]} />
        </Container>
      </section>

      <section id="iso" className="bg-white py-16 lg:py-20 scroll-mt-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionTitle title="ISO certifications" />
          <ul className="border-t-2 border-ink">
            {ISO_CERTS.map((cert) => (
              <li key={cert.standard} className="grid gap-1 border-b border-ink/20 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <span className="display text-[1.5rem] text-ink">{cert.standard}</span>
                <div>
                  <div className="font-bold text-ink">{cert.name}</div>
                  <p className="mt-1 max-w-[60ch] text-[16px] leading-relaxed text-steel">{cert.scope}</p>
                  <p className="mt-1 text-[15px] text-steel">Certificate available on request</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="gem" className="bg-concrete py-16 lg:py-20 scroll-mt-28">
        <Container>
          <SectionTitle title="GeM contracts" />
          <div className="mt-10 overflow-x-auto border-y-2 border-ink bg-white">
            <table className="w-full min-w-[640px] text-left text-[16px]">
              <thead>
                <tr className="border-b-2 border-ink bg-ink text-white">
                  <th scope="col" className="px-5 py-3 font-bold">Institution</th>
                  <th scope="col" className="px-5 py-3 font-bold">Ministry</th>
                  <th scope="col" className="px-5 py-3 text-right font-bold">Staff</th>
                  <th scope="col" className="px-5 py-3 text-right font-bold">Value</th>
                </tr>
              </thead>
              <tbody>
                {GEM_CONTRACTS.map((row, i) => (
                  <tr key={i} className="border-b border-ink/20">
                    <th scope="row" className="px-5 py-4 font-bold text-ink">{row.institution}</th>
                    <td className="px-5 py-4 text-steel">{row.ministry}</td>
                    <td className="px-5 py-4 text-right tabular-nums text-ink">{row.staff}</td>
                    <td className="px-5 py-4 text-right font-bold tabular-nums text-ink">{row.value}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink bg-concrete">
                  <th scope="row" className="px-5 py-4 font-bold text-ink">Total — 6 active contracts</th>
                  <td />
                  <td className="px-5 py-4 text-right font-bold tabular-nums text-ink">58</td>
                  <td className="px-5 py-4 text-right font-bold tabular-nums text-ink">₹2.04 Cr+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="display mt-14 text-[1.6rem] text-ink">Work completion record</h3>
          <dl className="mt-4 border-t-2 border-ink">
            {COMPLETIONS.map((c) => (
              <div key={c.org} className="grid gap-1 border-b border-ink/20 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6">
                <dt className="font-bold text-ink">{c.org}</dt>
                <dd className="text-steel">{c.note}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="financial" className="bg-white py-16 lg:py-20 scroll-mt-28">
        <Container>
          <SectionTitle title="Financial standing" />
          <dl className="mt-10 border-t-2 border-ink">
            {FINANCIALS.map((f) => (
              <div key={f.label} className="grid gap-1 border-b border-ink/20 py-5 sm:grid-cols-[16rem_14rem_1fr] sm:items-baseline sm:gap-6">
                <dt className="font-bold text-ink">{f.label}</dt>
                <dd className="display text-[2rem] tabular-nums text-ink">{f.value}</dd>
                <dd className="text-steel">{f.note}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-[60ch] border-l-4 border-hivis bg-concrete p-4 text-[16px] leading-relaxed text-ink">
            <strong>Note:</strong> Verify against current Sentinel Accounts records before publishing. Replace with updated FY25-26 turnover when available.
          </p>
        </Container>
      </section>

      <CtaBand
        title="Need a document package for a tender?"
        text="We'll prepare a compliance pack with ISO certificates, registration extracts, and GeM contract references — tailored to your tender requirements."
        primary={{ label: "Request Document Pack", to: "/contact" }}
        secondary={{ label: "WhatsApp us", href: "https://wa.me/919819301704" }}
      />
    </>
  );
}
