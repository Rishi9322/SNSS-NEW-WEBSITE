import { Link } from "react-router";
import { Container, CtaBand, PageHeader, SectionTitle } from "../components/kit";
import { TIMELINE, INDUSTRIES_SERVED, TESTIMONIALS } from "../constants";
import { useSEO } from "../hooks/useSEO";
import iso9001Badge from "../../assets/images/iso-9001-badge.webp";
import iso14001Badge from "../../assets/images/iso-14001-badge.webp";
import iso45001Badge from "../../assets/images/iso-45001-badge.webp";
import iso27001Badge from "../../assets/images/iso-27001-badge.webp";
import msmeUdyamBadge from "../../assets/images/msme-udyam-badge.webp";
import startupIndiaBadge from "../../assets/images/startup-india-badge.webp";
import aboutHeroImage from "../../assets/images/about-hero.webp";
import missionImage from "../../assets/images/mission-image.webp";

const STATS = [
  { value: "1999", label: "Year founded" },
  { value: "700+", label: "Staff deployed" },
  { value: "₹55 Cr+", label: "Annual turnover" },
  { value: "7+", label: "States covered" },
];

const CERTS = [
  { code: "ISO\n9001", image: iso9001Badge },
  { code: "ISO\n14001", image: iso14001Badge },
  { code: "ISO\n45001", image: iso45001Badge },
  { code: "ISO\n27001", image: iso27001Badge },
  { code: "ISO\n22000", image: undefined },
  { code: "ISO\n21001", image: undefined },
  { code: "MSME\nUdyam", image: msmeUdyamBadge },
  { code: "Startup\nIndia", image: startupIndiaBadge },
];

export function About() {
  useSEO({
    title: "About Sentinel IFM — 25 Years of Facilities Management in India",
    description: "Founded in Mumbai in 1999, Sentinel IFM is an ISO-certified integrated facilities management company serving corporate, government, and institutional clients across 7+ states.",
    path: "/about",
  });

  return (
    <>
      <PageHeader
        path={[{ label: "Home", to: "/" }, { label: "About" }]}
        title="25 years of doing one thing well."
        lede="Founded in 1999 as SNSS Global Services and now Sentinel IFM, the company has built a reputation for operational reliability, statutory compliance, and genuine partnership with corporate clients across India."
        image={aboutHeroImage}
        imagePosition="bottom"
        cropTop
      />

      {/* Mission */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <blockquote className="max-w-[960px]">
            <p className="display text-[clamp(1.9rem,3.8vw,3.1rem)] text-ink">
              “To empower businesses with competent and versatile workforce solutions through cost-effective and reliable staffing services.”
            </p>
            <cite className="mt-6 block text-[15px] font-bold not-italic text-steel">Sentinel Mission Statement</cite>
          </blockquote>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="max-w-[60ch] space-y-5 text-[17px] leading-relaxed text-steel">
              <p>
                Sentinel IFM Pvt. Ltd. is a Mumbai-headquartered MSME with 25+ years of unbroken operation in Integrated Facilities Management. Founded in 1999, we have served corporate offices, hospitals, malls, schools, factories, and central government institutions across 7+ states.
              </p>
              <p>
                A sophisticated buyer will ask: if you do everything, are you expert at anything? The answer is integration expertise, not category expertise. Our value is not being the best housekeeping company in India — it is being the company that a facility manager can call for any staffing or maintenance problem at any time, with one contract and one SLA.
              </p>
              <p>
                Every engagement begins with understanding your specific environment, workforce needs, and operational rhythms. We design a service model that fits — not a template.
              </p>
            </div>
            <dl className="self-start border-t-2 border-ink">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-4 border-b border-ink/20 py-4">
                  <dt className="text-[16px] text-steel">{s.label}</dt>
                  <dd className="display text-[2rem] tabular-nums text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-concrete py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionTitle title="How we got here" />
            <div className="mt-8 overflow-hidden rounded-[10px] border-2 border-ink">
              <img src={missionImage} alt="Sentinel IFM office — Mumbai headquarters" loading="lazy" decoding="async" className="block w-full object-cover" />
            </div>
          </div>
          <ol className="border-t-2 border-ink">
            {TIMELINE.map((item) => (
              <li key={item.year} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-ink/20 py-5 sm:grid-cols-[8rem_1fr]">
                <span className="display text-[clamp(2rem,4vw,3rem)] tabular-nums text-ink">{item.year}</span>
                <span className="max-w-[56ch] pt-1 text-[17px] leading-relaxed text-steel">{item.event}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Industries */}
      <section className="bg-ink py-16 text-white lg:py-20">
        <Container>
          <SectionTitle light title="One partner across every sector" />
          <ul className="mt-10 flex flex-wrap gap-3">
            {INDUSTRIES_SERVED.map((ind) => (
              <li key={ind} className="inline-flex min-h-[44px] items-center rounded-[4px] border-2 border-white/40 px-5 text-[15px] font-semibold text-white">
                {ind}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Certifications */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionTitle title="Recognised. Certified. Audited." />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CERTS.map((cert) => (
              <li key={cert.code} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-[4px] border-2 border-ink bg-concrete p-3 text-center">
                {cert.image && (
                  <img src={cert.image} alt={cert.code.replace("\n", " ")} loading="lazy" decoding="async" className="max-h-[50%] max-w-[60%] object-contain" />
                )}
                <span className="display whitespace-pre-line text-[17px] leading-tight text-ink">{cert.code}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link to="/compliance" className="inline-flex min-h-[44px] items-center text-[16px] font-bold text-ink underline decoration-hivis decoration-4 underline-offset-4 hover:decoration-ink">
              View all certifications & registration numbers
            </Link>
          </p>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-concrete py-16 lg:py-24">
        <Container>
          <SectionTitle title="What clients say" />
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className="flex flex-col gap-5 border-t-4 border-ink pt-5">
                <blockquote className="text-[17px] leading-relaxed text-ink">"{t.quote}"</blockquote>
                <figcaption>
                  <div className="font-bold text-ink">{t.author}</div>
                  <div className="text-[15px] text-steel">{t.role} · {t.company}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Ready to simplify your facility operations?"
        text="Tailored proposal within 4 business hours."
        primary={{ label: "Get a Free Quote", to: "/contact" }}
      />
    </>
  );
}
