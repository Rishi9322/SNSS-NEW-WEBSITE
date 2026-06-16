import { useEffect } from "react";
import { Link } from "react-router";
import { FadeIn } from "../components/FadeIn";
import { NAVY, AMBER, TIMELINE, INDUSTRIES_SERVED, TESTIMONIALS } from "../constants";

export function About() {
  useEffect(() => { document.title = "About Us | SNSS Global Services"; }, []);

  return (
    <>
      {/* Page header with background image */}
      <div className="relative py-24 lg:py-32 overflow-hidden" style={{ background: NAVY }}>
        <img
          src="https://picsum.photos/seed/snss-about-hero/1400/600"
          alt="SNSS corporate facilities management operations"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          style={{ mixBlendMode: "luminosity" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>
            <Link to="/" className="transition-opacity hover:opacity-70">Home</Link>
            <span className="mx-2 opacity-30">/</span>About
          </div>
          <h1 className="text-white mb-5 max-w-2xl" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.025em" }}>
            25 years of doing<br />one thing well.
          </h1>
          <p className="max-w-xl text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
            Founded in 1999, SNSS Global Services has built a reputation for operational reliability, statutory compliance, and genuine partnership with corporate clients across India.
          </p>
        </div>
      </div>

      {/* Mission + Story */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>Mission</p>
                <blockquote className="mb-8 pl-5 italic leading-relaxed text-base" style={{ borderLeft: `3px solid ${AMBER}`, color: "rgba(15,42,74,0.75)" }}>
                  "To empower businesses with competent and versatile workforce solutions through cost-effective and reliable staffing services."
                  <cite className="block mt-3 not-italic text-sm font-bold" style={{ color: NAVY }}>— SNSS Mission Statement</cite>
                </blockquote>
                <div className="space-y-4 text-sm leading-relaxed mb-10" style={{ color: "rgba(15,42,74,0.65)" }}>
                  <p>
                    SNSS Global Services Pvt. Ltd. is a Mumbai-headquartered MSME with 25+ years of unbroken operation in Integrated Facilities Management. Founded in 1999, we have served corporate offices, hospitals, malls, schools, factories, and central government institutions across 7+ states.
                  </p>
                  <p>
                    A sophisticated buyer will ask: if you do everything, are you expert at anything? The answer is integration expertise, not category expertise. Our value is not being the best housekeeping company in India — it is being the company that a facility manager can call for any staffing or maintenance problem at any time, with one contract and one SLA.
                  </p>
                  <p>
                    Every engagement begins with understanding your specific environment, workforce needs, and operational rhythms. We design a service model that fits — not a template.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-0 overflow-hidden" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
                  {[
                    { value: "1999", label: "Year founded" },
                    { value: "700+", label: "Staff deployed" },
                    { value: "₹55 Cr+", label: "Annual turnover" },
                    { value: "7+", label: "States covered" },
                  ].map((s, i) => (
                    <div key={i} className="p-5" style={{ borderRight: i % 2 === 0 ? "1px solid rgba(15,42,74,0.1)" : "none", borderBottom: i < 2 ? "1px solid rgba(15,42,74,0.1)" : "none" }}>
                      <div className="font-extrabold mb-0.5" style={{ fontSize: "1.8rem", color: AMBER, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                      <div className="text-xs uppercase tracking-wide" style={{ color: "rgba(15,42,74,0.5)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Timeline + image */}
            <FadeIn delay={0.1}>
              <div>
                {/* Office image */}
                <div className="mb-10 overflow-hidden" style={{ borderRadius: "4px" }}>
                  <img
                    src="https://picsum.photos/seed/snss-office-mumbai/700/380"
                    alt="SNSS Global Services office — Mumbai headquarters"
                    className="w-full object-cover"
                    style={{ display: "block" }}
                  />
                </div>

                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-8" style={{ color: "rgba(15,42,74,0.4)" }}>Timeline</p>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: "rgba(15,42,74,0.1)" }} />
                  {TIMELINE.map((item, i) => (
                    <FadeIn key={item.year} delay={i * 0.07}>
                      <div className="flex gap-6 pb-8 last:pb-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10" style={{ background: i === TIMELINE.length - 1 ? AMBER : "#fff", color: i === TIMELINE.length - 1 ? "#fff" : NAVY, border: `2px solid ${i === TIMELINE.length - 1 ? AMBER : "rgba(15,42,74,0.15)"}` }}>
                          {item.year.slice(2)}
                        </div>
                        <div className="pt-1">
                          <div className="text-xs font-bold mb-1" style={{ color: AMBER }}>{item.year}</div>
                          <div className="text-sm leading-relaxed" style={{ color: "rgba(15,42,74,0.65)" }}>{item.event}</div>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 lg:py-20" style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>Industries Served</p>
            <h2 className="text-white mb-10" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>One partner across every sector</h2>
          </FadeIn>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES_SERVED.map((ind, i) => (
              <FadeIn key={ind} delay={i * 0.03}>
                <span className="px-4 py-2 text-sm font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px" }}>{ind}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>Certifications</p>
            <h2 className="mb-10" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, color: NAVY, letterSpacing: "-0.02em" }}>Recognised. Certified. Audited.</h2>
          </FadeIn>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { code: "ISO\n9001", bg: NAVY },
              { code: "ISO\n14001", bg: "#1a3d5c" },
              { code: "ISO\n45001", bg: "#2a5470" },
              { code: "ISO\n27001", bg: "#0d2240" },
              { code: "MSME\nUdyam", bg: AMBER },
              { code: "Startup\nIndia", bg: "#c5751a" },
            ].map((cert, i) => (
              <FadeIn key={cert.code} delay={i * 0.06}>
                <div className="aspect-square rounded flex items-center justify-center font-bold text-white text-center text-xs leading-snug whitespace-pre-line" style={{ background: cert.bg }}>{cert.code}</div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div className="mt-8">
              <Link to="/compliance" className="text-sm font-bold flex items-center gap-1.5 transition-all hover:gap-2.5" style={{ color: AMBER }}>
                View all certifications & registration numbers
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 8h10M8 3l5 5-5 5" /></svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28" style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-16" style={{ color: AMBER }}>Client voices</p>
          </FadeIn>
          <div className="grid lg:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex flex-col gap-5" style={{ borderTop: `3px solid ${i === 0 ? AMBER : "rgba(255,255,255,0.1)"}`, paddingTop: "1.5rem" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>"{t.quote}"</p>
                  <div>
                    <div className="font-bold text-sm text-white">{t.author}</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: AMBER }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-white font-extrabold mb-1" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", letterSpacing: "-0.02em" }}>
              Ready to simplify your facility operations?
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Tailored proposal within 4 business hours.</p>
          </div>
          <Link to="/contact" className="flex-shrink-0 px-8 py-3.5 rounded text-sm font-bold transition-all hover:bg-white/90" style={{ background: "#fff", color: NAVY }}>
            Get a Free Quote
          </Link>
        </div>
      </section>
    </>
  );
}
