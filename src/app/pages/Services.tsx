import { Link } from "react-router";
import { FadeIn } from "../components/FadeIn";
import { NAVY, AMBER, SERVICES } from "../constants";
import { useSEO } from "../hooks/useSEO";

export function Services() {
  useSEO({
    title: "Facilities Management Services — Housekeeping, Pantry, Technical, Payroll & Staffing",
    description: "SNSS offers six integrated facilities management services: housekeeping, pantry management, electrical & technical maintenance, data entry, payroll compliance, and contract staffing across India.",
    path: "/services",
  });

  return (
    <>
      <div className="py-16 lg:py-20" style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>
            <Link to="/" className="transition-opacity hover:opacity-70">Home</Link>
            <span className="mx-2 opacity-30">/</span>Services
          </div>
          <h1 className="text-white mb-5" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.025em" }}>
            Six services.<br />Zero coordination overhead.
          </h1>
          <p className="max-w-2xl text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
            Most facilities teams manage three to five vendors for the same building. SNSS consolidates all of it — housekeeping, pantry, technical, payroll, staffing — under a single contract and a single point of accountability. That is the actual value: not any individual service, but the fact that you stop chasing vendors.
          </p>
        </div>
      </div>

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {SERVICES.map((svc, i) => (
              <FadeIn key={svc.id} delay={i * 0.06}>
                <Link to={`/services/${svc.slug}`} className="group flex flex-col p-8 h-full transition-all hover:bg-slate-50" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 rounded" style={{ background: "rgba(15,42,74,0.06)", color: NAVY }}>
                      {svc.icon}
                    </div>
                    <div>
                      <h2 className="font-bold mb-1" style={{ color: NAVY, fontSize: "1.05rem" }}>{svc.title}</h2>
                      <p className="text-xs" style={{ color: "rgba(15,42,74,0.45)" }}>{svc.industries}</p>
                    </div>
                  </div>
                  <p className="text-sm flex-1 mb-5 leading-relaxed" style={{ color: "rgba(15,42,74,0.65)" }}>{svc.desc}</p>
                  <div className="text-sm font-bold flex items-center gap-1.5 transition-all group-hover:gap-2.5" style={{ color: AMBER }}>
                    View service details
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 8h10M8 3l5 5-5 5" /></svg>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: NAVY }}>
        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-white font-bold mb-3" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>Not sure what you need?</h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
              Most clients come to us with a problem, not a service name. Tell us what's causing friction — we'll recommend the right combination and quote within 4 business hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="px-7 py-3 rounded text-sm font-bold text-white transition-all hover:brightness-110" style={{ background: AMBER }}>Talk to our team</Link>
              <a href="https://wa.me/918655362161" target="_blank" rel="noopener noreferrer" className="px-7 py-3 rounded text-sm font-bold transition-all hover:bg-white/10" style={{ color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}>WhatsApp Us</a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
