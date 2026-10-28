import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SERVICES, PROOF_POINTS, CORP_VALUE_PROPS, TESTIMONIALS } from "../constants";
import { useSEO } from "../hooks/useSEO";
import { Btn, Code, Container, CtaBand, SectionTitle } from "../components/kit";
import { CoveragePlan, ZONES } from "../components/CoveragePlan";
import testimonialsImage from "../../assets/images/testimonials-image.webp";

const HOME_FAQS = [
  { q: "What services does Sentinel IFM provide?", a: "Sentinel provides six integrated facilities management services: housekeeping and janitorial, pantry management, electrical and technical maintenance, data entry and office support, payroll management and labour compliance, and contract staffing including drivers and security personnel." },
  { q: "Which cities does Sentinel operate in?", a: "Sentinel has offices in Mumbai (corporate HQ), Pune, Ahmedabad, and Bhopal, and deploys staff across 7+ states in India." },
  { q: "Is Sentinel ISO certified?", a: "Yes. Sentinel holds six ISO certifications: ISO 9001:2015 (Quality), ISO 14001:2015 (Environment), ISO 45001:2018 (Health & Safety), ISO 27001:2013 (Information Security), ISO 22000:2018 (Food Safety), and ISO 21001:2018 (Educational Organisations)." },
  { q: "Does Sentinel handle PF and ESIC compliance for deployed staff?", a: "Yes. Sentinel manages all statutory compliance for its staff — EPFO (PF), ESIC, Professional Tax, and MLWF — at zero liability to the client organisation. Salaries are credited by the 7th of every month." },
  { q: "How quickly can Sentinel deploy staff for a new facility?", a: "Sentinel maintains a ready bench of trained, background-verified staff and can deploy drivers, housekeeping, and pantry personnel within 48 hours for urgent requirements." },
  { q: "Does Sentinel work with government organisations?", a: "Yes. Sentinel is empanelled on the Government e-Marketplace (GeM) and holds active contracts with central government bodies including EPFO, Sports Authority of India, and Kendriya Vidyalaya Sangathan." },
  { q: "What is Sentinel's replacement policy for absent staff?", a: "Sentinel guarantees same-day replacement from its bench strength if any deployed staff member is absent. The client does not need to make any calls — the replacement is arranged automatically." },
  { q: "How long has Sentinel been operating?", a: "Sentinel was founded in Mumbai in 1999 and has been providing integrated facilities management services for over 25 years, with operations across Maharashtra, Gujarat, and central India." },
  { q: "Can Sentinel manage multiple services under a single contract?", a: "Yes. This is Sentinel's core offering — all six services (housekeeping, pantry, technical, data entry, payroll, staffing) are managed under a single contract, single SLA, and single account manager." },
  { q: "How do I get a quote from Sentinel?", a: "You can request a quote via the contact form at sentinelifm.com/contact, by emailing info@sentinelifm.com, or by calling/WhatsApp at +91 86553 62161. Sentinel responds to all enquiries within 4 business hours." },
];

const CITIES = [
  { name: "Mumbai", tag: "Corporate office", addr: "409, Sej Plaza, Marve Road, Malad (W), Mumbai 400064", hq: true, mapsLink: "https://maps.google.com/?q=409+Sej+Plaza+Marve+Road+Malad+West+Mumbai+400064" },
  { name: "Pune", tag: "Branch office", addr: "Serving Pune metropolitan region and PCMC industrial corridor", hq: false, mapsLink: "https://maps.google.com/?q=Pune+Maharashtra+India" },
  { name: "Ahmedabad", tag: "Branch office", addr: "Serving Ahmedabad and the Gujarat industrial belt", hq: false, mapsLink: "https://maps.google.com/?q=Ahmedabad+Gujarat+India" },
  { name: "Bhopal", tag: "Branch office", addr: "Serving Bhopal and central India corporate clusters", hq: false, mapsLink: "https://maps.google.com/?q=Bhopal+Madhya+Pradesh+India" },
];

export function Home() {
  const [active, setActive] = useState<string | null>(null);

  useSEO({
    title: "Sentinel IFM | Integrated Facilities Management — Mumbai, Pune, Ahmedabad, Bhopal",
    description: "Sentinel provides integrated facilities management — housekeeping, pantry, technical maintenance, payroll compliance, and staffing — for corporate India. ISO certified. 25+ years. 700+ staff.",
    path: "/",
  });

  useEffect(() => {
    const id = "home-faq-schema";
    document.getElementById(id)?.remove();
    const el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": HOME_FAQS.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a },
      })),
    });
    document.head.appendChild(el);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  const featured = TESTIMONIALS[0];
  const others = TESTIMONIALS.slice(1);

  return (
    <>
      {/* Hero: the floor plan is the page's one memorable object. */}
      <section className="bg-concrete">
        <Container className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:py-24">
          <div>
            <h1 className="display text-[clamp(2.8rem,6.6vw,5rem)]">
              Your facility runs.<br />Your team focuses.
            </h1>
            <p className="mt-7 max-w-[50ch] text-[18px] leading-relaxed text-steel">
              Sentinel takes staffing, compliance, and day-to-day coordination completely off your plate: one vendor, one point of contact, full accountability. No chasing. No gaps.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Btn to="/contact">Get a free quote</Btn>
              <Btn to="/compliance" variant="ghost">View credentials</Btn>
            </div>
            <p className="mt-9 max-w-[46ch] text-[15px] text-steel">
              Serving corporate, government and institutional sites across 7+ states, from Mumbai, Pune, Ahmedabad and Bhopal, since 1999.
            </p>
          </div>

          <figure>
            <div className="border-2 border-ink bg-white p-3 sm:p-4">
              <CoveragePlan active={active} onActive={setActive} />
            </div>
            <figcaption className="mt-3 text-[14px] text-steel">
              One floor, six services we run on it. Select a room to see what we do there.
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* Directory */}
      <section className="bg-ink py-20 text-white lg:py-28">
        <Container>
          <SectionTitle
            light
            title="Six services. One accountable partner."
            intro="Each service is managed by the same team, under the same SLA, on the same invoice. That is the actual value."
          />
          <ul className="mt-14 border-b border-white/25">
            {SERVICES.map((svc) => {
              const code = ZONES.find((z) => z.slug === svc.slug)?.code ?? "";
              return (
                <li key={svc.id} className="border-t border-white/25">
                  <Link
                    to={`/services/${svc.slug}`}
                    onMouseEnter={() => setActive(svc.slug)}
                    onMouseLeave={() => setActive(null)}
                    className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 py-6 transition-colors hover:bg-white/5 md:grid-cols-[auto_1.1fr_1.5fr_auto] md:gap-x-8"
                  >
                    <Code>{code}</Code>
                    <span className="display text-[clamp(1.5rem,2.6vw,2.1rem)]">{svc.title}</span>
                    <span className="col-span-2 text-[16px] leading-relaxed text-white/80 md:col-span-1">{svc.outcome}</span>
                    <span className="col-span-2 text-[15px] font-bold text-hivis underline-offset-4 group-hover:underline md:col-span-1">View service</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Before / with Sentinel */}
      <section className="bg-white py-20 lg:py-28">
        <Container>
          <SectionTitle
            title="What changes when you hand it over."
            intro="These are operational headaches facility managers and HR leads tell us about. The right-hand column is what Sentinel absorbs completely."
          />
          <div className="mt-12 border-2 border-ink">
            <div className="hidden bg-ink text-[15px] font-bold text-white md:grid md:grid-cols-2">
              <div className="px-6 py-3">What you deal with today</div>
              <div className="bg-hivis px-6 py-3 text-ink">What you deal with with Sentinel</div>
            </div>
            <ul>
              {CORP_VALUE_PROPS.map((row, i) => (
                <li key={i} className="grid border-t-2 border-ink first:border-t-0 md:grid-cols-2 md:border-t md:border-ink/20 md:first:border-t-0">
                  <div className="px-5 py-5 md:px-6">
                    <span className="mb-1 block text-[13px] font-bold text-steel md:hidden">Today</span>
                    <span className="text-[16px] leading-relaxed text-steel">{row.problem}</span>
                  </div>
                  <div className="bg-concrete px-5 py-5 md:border-l-2 md:border-ink md:px-6">
                    <span className="mb-1 block text-[13px] font-bold text-steel md:hidden">With Sentinel</span>
                    <span className="text-[16px] font-semibold leading-relaxed">{row.solution}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Evidence ledger */}
      <section className="bg-concrete py-20 lg:py-28">
        <Container>
          <SectionTitle title="Why clients stay, not just why they buy." />
          <dl className="mt-12 border-b-2 border-ink">
            {PROOF_POINTS.map((pt) => (
              <div key={pt.label} className="grid gap-x-10 gap-y-2 border-t-2 border-ink py-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:items-baseline">
                <dt className="display text-[clamp(2.6rem,5.4vw,4.2rem)]">{pt.stat}</dt>
                <dd>
                  <span className="block text-[18px] font-bold">{pt.label}</span>
                  <span className="mt-1 block max-w-[58ch] text-[16px] leading-relaxed text-steel">{pt.detail}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 lg:py-28">
        <Container>
          <SectionTitle title="Operational reliability you notice from the first week." />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <figure className="flex flex-col gap-6">
              <div className="aspect-[16/9] overflow-hidden rounded-[10px] border-2 border-ink bg-concrete">
                <img src={testimonialsImage} alt="Sentinel facility team at work" width={1124} height={629} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <blockquote className="display text-[clamp(1.5rem,2.8vw,2.2rem)] !font-bold !leading-[1.15]" style={{ fontStretch: "92%" }}>
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <figcaption className="text-[15px]">
                <span className="font-bold">{featured.author}</span>, {featured.role}, {featured.company}
                {"tenure" in featured && <span className="text-steel"> (client for {(featured as { tenure: string }).tenure})</span>}
              </figcaption>
            </figure>
            <div className="divide-y-2 divide-ink border-y-2 border-ink">
              {others.map((t) => (
                <figure key={t.author} className="py-8 first:pt-6">
                  <blockquote className="text-[17px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-[15px]">
                    <span className="font-bold">{t.author}</span>, {t.role}, {t.company}
                    {"tenure" in t && <span className="text-steel"> (client for {(t as { tenure: string }).tenure})</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        title="Every enquiry gets a reply within 4 business hours."
        text="A real person calls or WhatsApps you. No auto-responders."
        primary={{ label: "Get a quote", to: "/contact" }}
        secondary={{ label: "WhatsApp now", href: "https://wa.me/918655362161" }}
      />

      {/* Presence */}
      <section className="bg-concrete py-20 lg:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle title="Four cities. Seven states." />
            <Link to="/contact#locations" className="inline-flex min-h-[44px] items-center text-[15px] font-bold underline underline-offset-4 hover:bg-hivis">See offices on the map</Link>
          </div>
          <ul className="mt-12 grid border-2 border-ink bg-white sm:grid-cols-2 lg:grid-cols-4">
            {CITIES.map((c, i) => (
              <li key={c.name} className={`flex flex-col p-6 ${i > 0 ? "border-t-2 border-ink" : ""} ${i === 1 ? "sm:border-t-0 sm:border-l-2" : ""} ${i === 2 ? "sm:border-l-0" : ""} ${i === 3 ? "sm:border-l-2" : ""} lg:border-t-0 ${i > 0 ? "lg:border-l-2" : ""} ${c.hq ? "bg-hivis" : ""}`}>
                <span className="text-[14px] font-semibold">{c.tag}</span>
                <span className="display mt-1 text-[2rem]">{c.name}</span>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed">{c.addr}</p>
                <a href={c.mapsLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-[44px] items-center text-[15px] font-bold underline underline-offset-4">
                  Open in Google Maps
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQ: native details/summary, no JavaScript */}
      <section className="bg-white py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
          <SectionTitle title="What buyers ask us first." />
          <div className="border-b-2 border-ink">
            {HOME_FAQS.map((faq) => (
              <details key={faq.q} className="group border-t-2 border-ink">
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[18px] font-bold [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span aria-hidden="true" className="display text-[2rem] leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[62ch] pb-6 text-[16px] leading-relaxed text-steel">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
