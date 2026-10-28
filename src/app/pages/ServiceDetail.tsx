import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { SERVICES } from "../constants";
import { ZONES } from "../components/CoveragePlan";
import { Btn, Code, Container, CtaBand, PageHeader } from "../components/kit";
import { useSEO } from "../hooks/useSEO";

import { SITE_URL as BASE } from "../site";

const Tick = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} className="mt-1 h-5 w-5 shrink-0 text-go"><path d="M3 8l3.5 3.5L13 5" /></svg>
);

// width / height of each service image (src/assets/images/service-*.webp), so the header frame never crops the sides.
const IMAGE_RATIO: Record<string, number> = {
  housekeeping: 900 / 328,
  pantry: 900 / 319,
  technical: 900 / 345,
  "data-entry": 900 / 600,
  payroll: 800 / 480,
  staffing: 900 / 600,
};

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const svc = SERVICES.find((s) => s.slug === slug);
  const related = SERVICES.filter((s) => svc?.relatedSlugs.includes(s.slug));
  const codeOf = (sl: string) => ZONES.find((z) => z.slug === sl)?.code ?? "";

  useSEO({
    title: svc ? `${svc.title} | Sentinel IFM` : "Service | Sentinel IFM",
    description: svc ? svc.subhead : "Integrated facilities management services for corporate India.",
    path: svc ? `/services/${svc.slug}` : "/services",
  });

  useEffect(() => {
    if (!svc) return;
    const id = "service-detail-schema";
    document.getElementById(id)?.remove();
    const el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": BASE + "/services" },
            { "@type": "ListItem", "position": 3, "name": svc.title, "item": `${BASE}/services/${svc.slug}` },
          ],
        },
        {
          "@type": "Service",
          "@id": `${BASE}/services/${svc.slug}#service`,
          "name": svc.title,
          "description": svc.subhead,
          "provider": { "@type": "Organization", "@id": BASE + "/#organization" },
          "serviceType": svc.title,
          "areaServed": ["Mumbai", "Pune", "Ahmedabad", "Bhopal"],
        },
      ],
    });
    document.head.appendChild(el);
    return () => { document.getElementById(id)?.remove(); };
  }, [svc]);

  if (!svc) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5">
        <h1 className="display text-3xl text-ink">Service not found</h1>
        <Link to="/services" className="inline-flex min-h-[44px] items-center font-bold text-ink underline underline-offset-4">Back to Services</Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        path={[{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: svc.shortTitle }]}
        title={svc.h1}
        lede={svc.subhead}
        image={svc.image}
        imageRatio={IMAGE_RATIO[svc.slug] ?? 1.5}
        imageAlt={svc.h1}
      >
        <div className="mt-8 flex items-center gap-3">
          <Code>{codeOf(svc.slug)}</Code>
          <span className="display text-xl text-white">{svc.shortTitle}</span>
        </div>
      </PageHeader>

      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
            <div className="space-y-14">
              <div>
                <h2 className="display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">What's included</h2>
                <ul className="mt-5 border-t-2 border-ink">
                  {svc.whatIncluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 border-b border-ink/20 py-4 text-[17px] leading-relaxed text-steel">
                      <Tick />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">Client benefits</h2>
                <ul className="mt-5 border-t-2 border-ink">
                  {svc.benefits.map((b, i) => (
                    <li key={i} className="border-b border-ink/20 py-4 text-[17px] leading-relaxed text-steel">{b}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">Industries served</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {svc.industries.split(" · ").map((ind) => (
                    <li key={ind} className="rounded-[3px] border border-ink/30 bg-concrete px-4 py-2 text-[15px] font-semibold text-ink">{ind}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-concrete p-6">
                <h2 className="display text-2xl text-ink">Backed by certifications</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {["ISO 9001:2015", "ISO 45001:2018", "MSME Udyam", "EPFO/ESIC Compliant"].map((cert) => (
                    <li key={cert} className="rounded-[3px] bg-ink px-3 py-1.5 text-sm font-bold text-white">{cert}</li>
                  ))}
                </ul>
                <Link to="/compliance" className="mt-4 inline-flex min-h-[44px] items-center font-bold text-ink underline underline-offset-4 decoration-2">
                  View all certifications & registrations
                </Link>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[10px] border-2 border-ink bg-concrete p-6">
                <h2 className="display text-2xl text-ink">Get a quote for {svc.shortTitle}</h2>
                <p className="mt-2 text-[16px] text-steel">Response within 4 business hours.</p>
                <div className="mt-5 flex flex-col gap-3">
                  <Btn to={`/contact?service=${svc.id}`}>Request this Service</Btn>
                  <Btn href="https://wa.me/919819301704" variant="ghost" external>WhatsApp Us</Btn>
                </div>
                <ul className="mt-6 border-t border-ink/25">
                  {["Background-verified, trained staff", "Full PF/ESIC compliance — zero liability", "Same-day replacement guarantee"].map((pt) => (
                    <li key={pt} className="flex items-start gap-2 border-b border-ink/15 py-3 text-[15px] text-steel">
                      <Tick />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-concrete py-14 lg:py-16">
          <Container>
            <h2 className="display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">Related services</h2>
            <ul className="mt-5 border-t-2 border-ink">
              {related.map((rel) => (
                <li key={rel.id} className="border-b border-ink/25">
                  <Link to={`/services/${rel.slug}`} className="flex min-h-[44px] items-start gap-4 py-5 hover:bg-white">
                    <Code tone="ink">{codeOf(rel.slug)}</Code>
                    <span>
                      <span className="display block text-xl text-ink">{rel.title}</span>
                      <span className="mt-1 block max-w-[60ch] text-[16px] text-steel">{rel.desc}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand
        title={`Need ${svc.shortTitle}?`}
        text="Tell us about your site. We reply with a quote within 4 business hours."
        primary={{ label: "Request this Service", to: `/contact?service=${svc.id}` }}
        secondary={{ label: "WhatsApp Us", href: "https://wa.me/919819301704" }}
      />
    </>
  );
}
