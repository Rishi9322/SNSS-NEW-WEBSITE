import { useEffect } from "react";
import { Link } from "react-router";
import { FadeIn } from "../components/FadeIn";
import { NAVY, AMBER, WA_PATH, SERVICES, PROOF_POINTS, CORP_VALUE_PROPS, TESTIMONIALS } from "../constants";
import { useSEO } from "../hooks/useSEO";

const HOME_FAQS = [
  { q: "What services does SNSS Global Services provide?", a: "SNSS provides six integrated facilities management services: housekeeping and janitorial, pantry management, electrical and technical maintenance, data entry and office support, payroll management and labour compliance, and contract staffing including drivers and security personnel." },
  { q: "Which cities does SNSS operate in?", a: "SNSS has offices in Mumbai (corporate HQ), Pune, Ahmedabad, and Bhopal, and deploys staff across 7+ states in India." },
  { q: "Is SNSS ISO certified?", a: "Yes. SNSS holds six ISO certifications: ISO 9001:2015 (Quality), ISO 14001:2015 (Environment), ISO 45001:2018 (Health & Safety), ISO 27001:2013 (Information Security), ISO 22000:2018 (Food Safety), and ISO 21001:2018 (Educational Organisations)." },
  { q: "Does SNSS handle PF and ESIC compliance for deployed staff?", a: "Yes. SNSS manages all statutory compliance for its staff — EPFO (PF), ESIC, Professional Tax, and MLWF — at zero liability to the client organisation. Salaries are credited by the 7th of every month." },
  { q: "How quickly can SNSS deploy staff for a new facility?", a: "SNSS maintains a ready bench of trained, background-verified staff and can deploy drivers, housekeeping, and pantry personnel within 48 hours for urgent requirements." },
  { q: "Does SNSS work with government organisations?", a: "Yes. SNSS is empanelled on the Government e-Marketplace (GeM) and holds active contracts with central government bodies including EPFO, Sports Authority of India, and Kendriya Vidyalaya Sangathan." },
  { q: "What is SNSS's replacement policy for absent staff?", a: "SNSS guarantees same-day replacement from its bench strength if any deployed staff member is absent. The client does not need to make any calls — the replacement is arranged automatically." },
  { q: "How long has SNSS been operating?", a: "SNSS was founded in Mumbai in 1999 and has been providing integrated facilities management services for over 25 years, with operations across Maharashtra, Gujarat, and central India." },
  { q: "Can SNSS manage multiple services under a single contract?", a: "Yes. This is SNSS's core offering — all six services (housekeeping, pantry, technical, data entry, payroll, staffing) are managed under a single contract, single SLA, and single account manager." },
  { q: "How do I get a quote from SNSS?", a: "You can request a quote via the contact form at snssgroup.com/contact, by emailing info@snssgroup.com, or by calling/WhatsApp at +91 86553 62161. SNSS responds to all enquiries within 4 business hours." },
];

export function Home() {
  useSEO({
    title: "SNSS Global Services | Integrated Facilities Management — Mumbai, Pune, Ahmedabad, Bhopal",
    description: "SNSS provides integrated facilities management — housekeeping, pantry, technical maintenance, payroll compliance, and staffing — for corporate India. ISO certified. 700+ staff. Est. 1999.",
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

  return (
    <>
      {/* ── HERO — split layout ── */}
      <section style={{ background: NAVY, minHeight: "92vh" }} className="flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 w-full py-16 lg:py-0" style={{ minHeight: "92vh", display: "flex", alignItems: "center" }}>
          <div className="grid lg:grid-cols-5 gap-0 w-full items-center" style={{ minHeight: "92vh" }}>

            {/* Left: copy */}
            <div className="lg:col-span-3 py-20">
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-8" style={{ color: AMBER }}>
                Trusted by corporate India since 1999
              </p>
              <h1 className="text-white mb-8" style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                Your facility runs.<br />
                <span style={{ color: AMBER }}>Your team focuses.</span>
              </h1>
              <p className="mb-10 max-w-xl" style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(1rem, 1.4vw, 1.1rem)", lineHeight: 1.8 }}>
                SNSS takes staffing, compliance, and day-to-day coordination completely off your plate — one vendor, one point of contact, full accountability. No chasing. No gaps.
              </p>
              <div className="flex flex-wrap gap-3 mb-16">
                <Link to="/contact" className="px-7 py-3.5 rounded font-bold text-sm transition-all hover:brightness-110 active:scale-95" style={{ background: AMBER, color: "#fff" }}>
                  Get a Free Quote
                </Link>
                <Link to="/compliance" className="px-7 py-3.5 rounded font-bold text-sm transition-all hover:bg-white/10 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  View Credentials
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 8h10M8 3l5 5-5 5" /></svg>
                </Link>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { value: "25+", label: "Years Est. 1999" },
                  { value: "700+", label: "Trained Staff" },
                  { value: "₹55 Cr+", label: "Annual Turnover" },
                  { value: "7+", label: "States Covered" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-extrabold" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", color: AMBER, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image */}
            <div className="hidden lg:block lg:col-span-2 self-stretch relative" style={{ minHeight: "92vh" }}>
              <div className="absolute inset-0" style={{ marginLeft: "3rem" }}>
                {/* Amber accent line */}
                <div className="absolute left-0 top-[15%] bottom-[15%] w-1" style={{ background: AMBER }} />
                <img
                  src="https://picsum.photos/seed/office-facility-1/700/1000"
                  alt="Professional facility management — clean corporate office environment"
                  className="w-full h-full object-cover"
                  style={{ marginLeft: "1rem" }}
                  width={700}
                  height={1000}
                  fetchPriority="high"
                />
                {/* Stat overlay card */}
                <div className="absolute bottom-12 left-4 right-8 p-5" style={{ background: NAVY, border: `1px solid rgba(255,255,255,0.1)` }}>
                  <div className="font-extrabold mb-1" style={{ color: AMBER, fontSize: "1.8rem", lineHeight: 1 }}>₹2.04 Cr+</div>
                  <div className="text-white text-sm font-bold">Active GeM contracts</div>
                  <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Government-verified — 6 central institutions</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-14" style={{ color: AMBER }}>
              Why organisations choose SNSS
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {PROOF_POINTS.map((pt, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="flex flex-col gap-3" style={{ borderTop: `2px solid ${i === 0 ? AMBER : "rgba(15,42,74,0.1)"}`, paddingTop: "1.25rem" }}>
                  <div className="font-extrabold" style={{ fontSize: "2rem", color: NAVY, lineHeight: 1, letterSpacing: "-0.02em" }}>{pt.stat}</div>
                  <div className="font-bold text-sm" style={{ color: NAVY }}>{pt.label}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(15,42,74,0.6)" }}>{pt.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES — editorial numbered list ── */}
      <section style={{ background: NAVY }} className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: AMBER }}>What we do</p>
                <h2 className="text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
                  Six services.<br />One accountable partner.
                </h2>
              </div>
              <Link to="/services" className="flex-shrink-0 text-sm font-bold flex items-center gap-2 transition-all hover:gap-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                All services
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 8h10M8 3l5 5-5 5" /></svg>
              </Link>
            </div>
          </FadeIn>

          <div>
            {SERVICES.map((svc, i) => (
              <FadeIn key={svc.id} delay={i * 0.05}>
                <Link to={`/services/${svc.slug}`} className="group flex items-center gap-6 py-5 transition-all" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-xs font-bold tabular-nums w-6 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>0{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold mb-1 text-white/90 group-hover:text-amber-400 transition-colors" style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}>
                      {svc.title}
                    </div>
                    <p className="text-sm hidden lg:block text-white/55">{svc.outcome}</p>
                  </div>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                    <path d="M3 8h10M8 3l5 5-5 5" />
                  </svg>
                </Link>
              </FadeIn>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
          </div>

          <FadeIn delay={0.3}>
            <p className="mt-10 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Each service is managed by the same team, under the same SLA, on the same invoice. That's the actual value.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── CORPORATE VALUE PROP TABLE ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: AMBER }}>Before &amp; after SNSS</p>
            <h2 className="mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: NAVY, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
              What changes when you hand it over.
            </h2>
            <p className="mb-12 max-w-xl text-sm" style={{ color: "rgba(15,42,74,0.6)", lineHeight: 1.75 }}>
              These are real operational headaches we've heard from facility managers and HR leads. Every row on the right is something SNSS absorbs completely.
            </p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(15,42,74,0.12)" }}>
              <div className="grid grid-cols-2 text-xs font-bold py-3 px-6 tracking-wider uppercase" style={{ background: NAVY, color: "white" }}>
                <div>What you deal with today</div>
                <div style={{ color: AMBER }}>What you deal with after SNSS</div>
              </div>
              {CORP_VALUE_PROPS.map((row, i) => (
                <div key={i} className="grid grid-cols-2 text-sm py-4 px-6" style={{ borderTop: "1px solid rgba(15,42,74,0.07)", background: i % 2 === 1 ? "rgba(15,42,74,0.02)" : "#fff" }}>
                  <div className="pr-6" style={{ color: "rgba(15,42,74,0.65)" }}>{row.problem}</div>
                  <div className="pl-6 font-semibold" style={{ color: NAVY, borderLeft: "1px solid rgba(15,42,74,0.08)" }}>{row.solution}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-8">
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-bold transition-all hover:brightness-110" style={{ background: NAVY, color: "#fff" }}>
                Talk to our team
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 8h10M8 3l5 5-5 5" /></svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TESTIMONIALS + image ── */}
      <section style={{ background: NAVY }} className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="grid lg:grid-cols-5 gap-12 items-start mb-16">
              <div className="lg:col-span-3">
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: AMBER }}>
                  Why clients stay — not just why they buy
                </p>
                <h2 className="text-white" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                  Operational reliability you notice from the first week.
                </h2>
              </div>
              <div className="hidden lg:block lg:col-span-2">
                <img
                  src="https://picsum.photos/seed/corporate-office-team/600/340"
                  alt="Corporate facility management team"
                  className="w-full object-cover"
                  style={{ borderRadius: "2px", filter: "brightness(0.75) saturate(0.8)" }}
                  width={600}
                  height={340}
                  loading="lazy"
                />
              </div>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex flex-col gap-5" style={{ borderTop: `3px solid ${i === 0 ? AMBER : "rgba(255,255,255,0.12)"}`, paddingTop: "1.5rem" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>
                    "{t.quote}"
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="font-bold text-sm text-white">{t.author}</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{t.role} · {t.company}</div>
                    </div>
                    {"tenure" in t && (
                      <div className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>
                        {(t as { tenure: string }).tenure}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-16" style={{ background: AMBER }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <FadeIn>
            <div>
              <h2 className="text-white font-extrabold mb-1" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-0.02em" }}>
                Every enquiry. 4 business hours.
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>A real person calls or WhatsApps you. No auto-responders.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.05}>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link to="/contact" className="px-7 py-3.5 rounded font-bold text-sm transition-all hover:bg-white/90" style={{ background: "#fff", color: NAVY }}>
                Get a Quote
              </Link>
              <a href="https://wa.me/918655362161" target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 rounded font-bold text-sm transition-all hover:bg-white/10 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d={WA_PATH} /></svg>
                WhatsApp Now
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PRESENCE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between gap-4 mb-14">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: AMBER }}>Presence</p>
                <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: NAVY, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
                  4 cities · 7+ states
                </h2>
              </div>
              <Link to="/contact#locations" className="hidden sm:flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70 flex-shrink-0" style={{ color: AMBER }}>
                View all maps
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 8h10M8 3l5 5-5 5" /></svg>
              </Link>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 overflow-hidden" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
            {[
              { name: "Mumbai", tag: "Corporate Office", addr: "409, Sej Plaza, Marve Road, Malad (W), Mumbai – 400064", hq: true, mapsLink: "https://maps.google.com/?q=409+Sej+Plaza+Marve+Road+Malad+West+Mumbai+400064" },
              { name: "Pune", tag: "Branch Office", addr: "Serving Pune metropolitan region and PCMC industrial corridor", hq: false, mapsLink: "https://maps.google.com/?q=Pune+Maharashtra+India" },
              { name: "Ahmedabad", tag: "Branch Office", addr: "Serving Ahmedabad and the Gujarat industrial belt", hq: false, mapsLink: "https://maps.google.com/?q=Ahmedabad+Gujarat+India" },
              { name: "Bhopal", tag: "Branch Office", addr: "Serving Bhopal and central India corporate clusters", hq: false, mapsLink: "https://maps.google.com/?q=Bhopal+Madhya+Pradesh+India" },
            ].map((city, i) => (
              <FadeIn key={city.name} delay={i * 0.08}>
                <div className="p-7 h-full flex flex-col" style={{ background: city.hq ? NAVY : "#fff", borderRight: i < 3 ? "1px solid rgba(15,42,74,0.1)" : "none" }}>
                  <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: city.hq ? AMBER : "rgba(15,42,74,0.4)" }}>{city.tag}</div>
                  <div className="font-extrabold mb-2" style={{ fontSize: "1.4rem", color: city.hq ? "#fff" : NAVY, letterSpacing: "-0.02em" }}>{city.name}</div>
                  <p className="text-sm flex-1 mb-4" style={{ color: city.hq ? "rgba(255,255,255,0.55)" : "rgba(15,42,74,0.6)", lineHeight: 1.65 }}>{city.addr}</p>
                  <a
                    href={city.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70"
                    style={{ color: city.hq ? AMBER : AMBER }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    Open in Google Maps
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3l-6 6" /></svg>
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: AMBER }}>Common questions</p>
            <h2 className="mb-12" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: NAVY, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
              What buyers ask us first.
            </h2>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-x-16 gap-y-8">
            {HOME_FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div style={{ borderTop: "1px solid rgba(15,42,74,0.1)", paddingTop: "1.25rem" }}>
                  <h3 className="font-bold text-sm mb-2" style={{ color: NAVY }}>{faq.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(15,42,74,0.6)" }}>{faq.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREERS BAND ── */}
      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-7 py-9 sm:px-10"
              style={{ background: NAVY, borderRadius: "12px", boxShadow: "0 16px 40px rgba(15,42,74,0.18)" }}
            >
              <div>
                <div className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: AMBER }}>Careers</div>
                <h3 className="text-white font-bold mb-1" style={{ fontSize: "1.15rem", letterSpacing: "-0.01em" }}>Join 700+ professionals across India</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>PF, ESIC, salary by the 7th — every employee, every month.</p>
              </div>
              <Link to="/careers" className="flex-shrink-0 px-6 py-3 rounded text-sm font-bold transition-all hover:brightness-110" style={{ background: AMBER, color: "#fff" }}>
                View Careers
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
