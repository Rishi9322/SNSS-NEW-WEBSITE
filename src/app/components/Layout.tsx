import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { NAVY, AMBER, SERVICES } from "../constants";
import logo from "../../assets/snss-logo.png";

const NAV = [
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Compliance", to: "/compliance" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); setServicesOpen(false); window.scrollTo(0, 0); }, [location.pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: NAVY }}>

      {/* Top bar */}
      <div className="hidden lg:flex items-center justify-between px-8 py-2 text-xs" style={{ background: "#08192e", color: "rgba(255,255,255,0.45)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span>ISO Certified · Est. 1999 · MSME Udyam · Startup India DIPP115148</span>
        <div className="flex items-center gap-6">
          <a href="mailto:INFO@SNSSGROUP.COM" className="hover:text-white transition-colors">INFO@SNSSGROUP.COM</a>
          <a href="https://wa.me/918655362161" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+91 86553 62161</a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-200" style={{ background: scrolled ? "rgba(15,42,74,0.96)" : NAVY, backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-[64px]">

          <Link to="/" className="flex items-center flex-shrink-0 focus:outline-none">
            <img src={logo} alt="SNSS Global Services" className="h-9 lg:h-11 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <Link to="/services" className="flex items-center gap-1 text-sm px-3 py-2 rounded transition-colors" style={{ color: location.pathname.startsWith("/services") ? "#fff" : "rgba(255,255,255,0.6)" }}>
                Services
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3 h-3 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}><path d="M2 4l4 4 4-4" /></svg>
              </Link>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 pt-1.5 z-50 w-60">
                    <div className="overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(15,42,74,0.12)", borderRadius: "6px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                      {SERVICES.map((s) => (
                        <Link key={s.slug} to={`/services/${s.slug}`} className="block px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 border-b last:border-0" style={{ borderColor: "rgba(15,42,74,0.06)", color: NAVY }}>
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV.filter(l => l.label !== "Services").map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `text-sm px-3 py-2 rounded transition-colors ${isActive ? "text-white" : "text-white/60 hover:text-white"}`}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/contact" className="ml-2 px-5 py-2 rounded text-sm font-bold transition-all hover:brightness-110 active:scale-95" style={{ background: AMBER, color: "#fff" }}>
              Get a Quote
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden" style={{ background: "#08192e", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-5 py-4 flex flex-col">
                <Link to="/services" className="text-white/70 hover:text-white text-sm py-3 border-b border-white/5">Services</Link>
                {SERVICES.map((s) => (
                  <Link key={s.slug} to={`/services/${s.slug}`} className="pl-4 py-2.5 text-xs border-b border-white/5 last:border-0" style={{ color: "rgba(255,255,255,0.45)" }}>{s.title}</Link>
                ))}
                {NAV.filter(l => l.label !== "Services").map((l) => (
                  <Link key={l.to} to={l.to} className="text-white/70 hover:text-white text-sm py-3 border-b border-white/5">{l.label}</Link>
                ))}
                <Link to="/contact" className="mt-4 w-full py-3 rounded text-sm font-bold text-center" style={{ background: AMBER, color: "#fff" }}>Get a Quote</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1"><Outlet /></main>

      {/* Footer */}
      <footer style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.07)" }} className="pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-5">
                <img src={logo} alt="SNSS Global Services" className="h-10 w-auto" />
                <div className="text-[10px] tracking-widest uppercase mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>Pvt. Ltd. · Est. 1999</div>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Integrated Facilities Management for corporate India. 25 years. 700+ staff. ISO certified.
              </p>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Statutory Registrations</div>
                {[
                  { k: "CIN", v: "U74999MH2019PTC323363" },
                  { k: "GST", v: "27ABBCS8372G1Z2" },
                  { k: "MSME", v: "UDYAM-MH-18-0067937" },
                  { k: "DIPP", v: "DIPP115148" },
                ].map((r) => (
                  <div key={r.k} className="flex gap-3 text-[11px] mb-1.5">
                    <span className="w-9 flex-shrink-0 font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>{r.k}</span>
                    <span className="font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Company</div>
              <ul className="space-y-3">
                {[
                  { label: "Home", to: "/" }, { label: "About Us", to: "/about" }, { label: "Services", to: "/services" },
                  { label: "Compliance", to: "/compliance" }, { label: "Careers", to: "/careers" },
                  { label: "Contact", to: "/contact" }, { label: "Privacy Policy", to: "/privacy" }, { label: "Terms", to: "/terms" },
                ].map((l) => <li key={l.to}><Link to={l.to} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.5)" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>{l.label}</Link></li>)}
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Services</div>
              <ul className="space-y-3">
                {SERVICES.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.5)" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>{s.title}</Link></li>)}
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Contact</div>
              <ul className="space-y-5">
                <li>
                  <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>Head Office</div>
                  <address className="not-italic text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>409, Sej Plaza, Marve Road<br />Malad (W), Mumbai – 400064</address>
                </li>
                <li>
                  <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>Email</div>
                  <a href="mailto:INFO@SNSSGROUP.COM" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>INFO@SNSSGROUP.COM</a>
                </li>
                <li>
                  <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>WhatsApp</div>
                  <a href="https://wa.me/918655362161" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>+91 86553 62161</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              © {new Date().getFullYear()} SNSS Global Services Pvt. Ltd. · An ISO Certified Company
            </p>
            <div className="flex gap-5">
              <Link to="/privacy" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}>Privacy Policy</Link>
              <Link to="/terms" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/918655362161" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ width: 52, height: 52, background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.4)" }} aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
