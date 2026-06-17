import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { FadeIn } from "../components/FadeIn";
import { NAVY, AMBER, SERVICES } from "../constants";


export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const svc = SERVICES.find((s) => s.slug === slug);
  const related = SERVICES.filter((s) => svc?.relatedSlugs.includes(s.slug));

  useEffect(() => { if (svc) document.title = `${svc.title} | SNSS Global Services`; }, [svc]);

  if (!svc) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Service not found</h1>
        <Link to="/services" className="text-sm font-bold" style={{ color: AMBER }}>← Back to Services</Link>
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="relative overflow-hidden" style={{ background: NAVY }}>
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-32">
          <div className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>
            <Link to="/" className="transition-opacity hover:opacity-70">Home</Link>
            <span className="mx-2 opacity-30">/</span>
            <Link to="/services" className="transition-opacity hover:opacity-70">Services</Link>
            <span className="mx-2 opacity-30">/</span>{svc.shortTitle}
          </div>
          <div className="max-w-2xl">
            <h1 className="text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
              {svc.h1}
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>{svc.subhead}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-14">
              <FadeIn>
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>What's included</p>
                  <ul className="space-y-3">
                    {svc.whatIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(15,42,74,0.7)" }}>
                        <svg viewBox="0 0 16 16" fill="none" stroke={AMBER} strokeWidth={2.5} className="w-4 h-4 flex-shrink-0 mt-0.5"><path d="M3 8l3.5 3.5L13 5" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              <FadeIn delay={0.05}>
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase mb-6" style={{ color: AMBER }}>Client benefits</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {svc.benefits.map((b, i) => (
                      <div key={i} className="p-5" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(15,42,74,0.7)" }}>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: AMBER }}>Industries served</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.industries.split(" · ").map((ind) => (
                      <span key={ind} className="px-4 py-2 text-sm font-medium" style={{ background: "rgba(15,42,74,0.05)", color: NAVY, border: "1px solid rgba(15,42,74,0.1)", borderRadius: "3px" }}>{ind}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="p-6" style={{ background: "rgba(15,42,74,0.03)", border: "1px solid rgba(15,42,74,0.08)", borderRadius: "4px" }}>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: NAVY }}>Backed by certifications</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["ISO 9001:2015", "ISO 45001:2018", "MSME Udyam", "EPFO/ESIC Compliant"].map((cert) => (
                      <span key={cert} className="px-3 py-1.5 text-xs font-bold" style={{ background: NAVY, color: "#fff", borderRadius: "3px" }}>{cert}</span>
                    ))}
                  </div>
                  <Link to="/compliance" className="text-sm font-bold flex items-center gap-1.5 transition-all hover:gap-2.5" style={{ color: AMBER }}>
                    View all certifications & registrations
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 8h10M8 3l5 5-5 5" /></svg>
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div>
              <FadeIn delay={0.06}>
                <div className="sticky top-24 p-7" style={{ background: NAVY, borderRadius: "4px" }}>
                  <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.05rem" }}>Get a quote for {svc.shortTitle}</h3>
                  <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                    Response within 4 business hours.
                  </p>
                  <Link to={`/contact?service=${svc.id}`} className="block w-full text-center py-3.5 text-sm font-bold text-white transition-all hover:brightness-110 mb-3" style={{ background: AMBER, borderRadius: "4px" }}>
                    Request this Service
                  </Link>
                  <a href="https://wa.me/918655362161" target="_blank" rel="noopener noreferrer"
                    className="block w-full text-center py-3.5 text-sm font-bold transition-all hover:bg-white/10 mb-8"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px" }}>
                    WhatsApp Us
                  </a>
                  <div className="space-y-3 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Background-verified, trained staff", "Full PF/ESIC compliance — zero liability", "Same-day replacement guarantee"].map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                        <svg viewBox="0 0 16 16" fill="none" stroke={AMBER} strokeWidth={2} className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"><path d="M3 8l3.5 3.5L13 5" /></svg>
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16" style={{ background: NAVY }}>
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <FadeIn>
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-8" style={{ color: AMBER }}>Related Services</p>
            </FadeIn>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rel, i) => (
                <FadeIn key={rel.id} delay={i * 0.08}>
                  <Link to={`/services/${rel.slug}`} className="group flex items-start gap-5 p-6 transition-all hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px" }}>
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ borderRadius: "4px", background: "rgba(255,255,255,0.08)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth={1.5} className="w-5 h-5"><path d="M9 12h6M9 16h6M7 4h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-1 text-white">{rel.title}</div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{rel.desc}</p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
