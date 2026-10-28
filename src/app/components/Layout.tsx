import { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { SERVICES, WA_PATH } from "../constants";
import { Btn, Container } from "./kit";
import { ZONES } from "./CoveragePlan";
import logo from "../../assets/images/sentinel-logo.webp";

const NAV = [
  { label: "About", to: "/about" },
  { label: "Compliance", to: "/compliance" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

const codeFor = (slug: string) => ZONES.find((z) => z.slug === slug)?.code ?? "";

const REGISTRATIONS = [
  { k: "CIN", v: "U74999MH2019PTC323363" },
  { k: "GST", v: "27ABBCS8372G1Z2" },
  { k: "MSME", v: "UDYAM-MH-18-0067937" },
  { k: "DIPP", v: "DIPP115148" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); setServicesOpen(false); setFabOpen(false); window.scrollTo(0, 0); }, [location.pathname]);
  useEffect(() => {
    const away = (e: MouseEvent) => { if (fabRef.current && !fabRef.current.contains(e.target as Node)) setFabOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setFabOpen(false); setServicesOpen(false); } };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, []);

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-[15px] font-semibold text-ink transition-colors hover:bg-ink/10 ${isActive ? "after:absolute after:inset-x-3 after:-bottom-[2px] after:h-[3px] after:bg-hivis after:content-['']" : ""}`;

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-[4px] focus:bg-hivis focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-ink">
        Skip to main content
      </a>

      <div className="hidden bg-ink text-[13px] text-white/80 lg:block">
        <Container className="flex justify-end gap-6 py-2">
          <a href="mailto:info@sentinelifm.com" className="hover:text-white hover:underline">info@sentinelifm.com</a>
          <a href="tel:+918655362161" className="hover:text-white hover:underline">+91 86553 62161</a>
        </Container>
      </div>

      <header className="sticky top-0 z-50 bg-mist shadow-[0_2px_0_0_var(--color-ink)]">
        <Container className="flex h-[76px] items-stretch justify-between lg:h-[96px]">
          <Link to="/" className="flex items-center" aria-label="Sentinel IFM home">
            <img src={logo} alt="Sentinel Security Services & Integrated Facility Management" className="h-[52px] w-auto lg:h-[72px]" width={218} height={72} decoding="async" fetchPriority="high" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false); }}
            >
              <Link
                to="/services"
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onFocus={() => setServicesOpen(true)}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-[15px] font-semibold text-ink hover:bg-ink/10 ${location.pathname.startsWith("/services") ? "after:absolute after:inset-x-3 after:-bottom-[2px] after:h-[3px] after:bg-hivis after:content-['']" : ""}`}
              >
                Services
                <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} className={`h-3 w-3 transition-transform ${servicesOpen ? "rotate-180" : ""}`}><path d="M2 4l4 4 4-4" /></svg>
              </Link>
              {servicesOpen && (
                <div className="absolute left-0 top-full z-50 w-72 pt-2">
                  <ul className="border-2 border-ink bg-white">
                    {SERVICES.map((s) => (
                      <li key={s.slug} className="border-b border-ink/15 last:border-0">
                        <Link to={`/services/${s.slug}`} className="flex items-center gap-3 px-3 py-3 text-[15px] font-semibold text-ink hover:bg-hivis">
                          <span aria-hidden="true" className="display w-7 text-[15px]">{codeFor(s.slug)}</span>
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {NAV.map((l) => <NavLink key={l.to} to={l.to} className={navLink}>{l.label}</NavLink>)}
            <Btn to="/contact" className="ml-3 !min-h-[44px]">Request a quote</Btn>
          </nav>

          <button
            type="button"
            className="-mr-3 flex min-w-[48px] items-center justify-center lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="flex w-6 flex-col gap-[6px]" aria-hidden="true">
              <span className={`h-[3px] bg-ink transition-transform ${menuOpen ? "translate-y-[9px] rotate-45" : ""}`} />
              <span className={`h-[3px] bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-[3px] bg-ink transition-transform ${menuOpen ? "-translate-y-[9px] -rotate-45" : ""}`} />
            </span>
          </button>
        </Container>

        {menuOpen && (
          <div id="mobile-menu" className="border-t-2 border-ink bg-mist lg:hidden">
            <Container className="flex flex-col py-2">
              <button
                type="button"
                onClick={() => setServicesOpen(!servicesOpen)}
                aria-expanded={servicesOpen}
                className="flex min-h-[52px] items-center justify-between border-b border-ink/20 text-left text-[17px] font-semibold"
              >
                Services
                <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}><path d="M2 4l4 4 4-4" /></svg>
              </button>
              {servicesOpen && (
                <ul className="border-b border-ink/20 bg-white/50">
                  <li><Link to="/services" className="flex min-h-[48px] items-center pl-4 text-[15px] font-semibold">All services</Link></li>
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} className="flex min-h-[48px] items-center gap-3 pl-4 text-[15px]">
                        <span aria-hidden="true" className="display w-7">{codeFor(s.slug)}</span>{s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {NAV.map((l) => (
                <Link key={l.to} to={l.to} className="flex min-h-[52px] items-center border-b border-ink/20 text-[17px] font-semibold">{l.label}</Link>
              ))}
              <Btn to="/contact" className="my-4 w-full">Request a quote</Btn>
            </Container>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1"><Outlet /></main>

      <footer className="bg-ink text-white">
        <div aria-hidden="true" className="h-2 bg-hivis" />
        <Container className="py-16">
          <div className="grid gap-12 border-b border-white/20 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
            <div>
              <div className="inline-block bg-mist px-4 py-3">
                <img src={logo} alt="Sentinel Security Services & Integrated Facility Management" className="h-14 w-auto" width={170} height={56} loading="lazy" decoding="async" />
              </div>
              <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-white/80">
                Integrated facilities management for corporate India. Since 1999. 700+ staff. ISO certified.
              </p>
              <dl className="mt-6 space-y-1.5 text-[13px]">
                {REGISTRATIONS.map((r) => (
                  <div key={r.k} className="flex gap-3">
                    <dt className="w-12 shrink-0 font-semibold text-white">{r.k}</dt>
                    <dd className="font-mono text-white/80">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <nav aria-label="Company">
              <h2 className="display text-xl">Company</h2>
              <ul className="mt-4 space-y-1">
                {[["Home", "/"], ["About", "/about"], ["Services", "/services"], ["Compliance", "/compliance"], ["Careers", "/careers"], ["Contact", "/contact"], ["Labour Law Assist", "/assist"], ["Privacy policy", "/privacy"], ["Terms of service", "/terms"]].map(([label, to]) => (
                  <li key={to}><Link to={to} className="inline-flex min-h-[36px] items-center text-[15px] text-white/80 underline-offset-4 hover:text-white hover:underline">{label}</Link></li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Services">
              <h2 className="display text-xl">Services</h2>
              <ul className="mt-4 space-y-1">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`} className="flex min-h-[36px] items-center gap-3 text-[15px] text-white/80 hover:text-white hover:underline underline-offset-4">
                      <span aria-hidden="true" className="display w-7 text-hivis">{codeFor(s.slug)}</span>{s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="display text-xl">Contact</h2>
              <address className="mt-4 text-[15px] not-italic leading-relaxed text-white/80">
                409, Sej Plaza, Marve Road<br />Malad (W), Mumbai 400064
              </address>
              <ul className="mt-4 space-y-1 text-[15px]">
                <li><a href="mailto:info@sentinelifm.com" className="inline-flex min-h-[36px] items-center text-white underline underline-offset-4 hover:text-hivis">info@sentinelifm.com</a></li>
                <li><a href="tel:+918655362161" className="inline-flex min-h-[36px] items-center text-white underline underline-offset-4 hover:text-hivis">+91 86553 62161</a></li>
              </ul>
              <p className="mt-4 text-[15px] text-white/80">Offices in Mumbai, Pune, Ahmedabad and Bhopal.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-8 text-[13px] text-white/75 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Sentinel IFM Pvt. Ltd. An ISO certified company.</p>
            <p>Formerly SNSS Global Services.</p>
          </div>
        </Container>
      </footer>

      <div ref={fabRef} className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {fabOpen && (
          <>
            <Link to="/assist" className="flex min-h-[48px] items-center gap-2 rounded-full bg-hivis px-5 text-sm font-bold text-ink shadow-[0_0_0_2px_var(--color-ink)]">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-4 w-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Ask Labour Law Assist
            </Link>
            <a href="https://wa.me/918655362161" target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-ink shadow-[0_0_0_2px_var(--color-ink)]">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d={WA_PATH} /></svg>
              WhatsApp us
            </a>
          </>
        )}
        <button
          type="button"
          onClick={() => setFabOpen((o) => !o)}
          aria-label="Contact options"
          aria-expanded={fabOpen}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-[0_0_0_3px_var(--color-hivis)] transition-transform hover:scale-105"
        >
          {fabOpen
            ? <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M21 12c0 4.4-4 8-9 8a9.9 9.9 0 01-4.3-.9L3 20l1.4-3.7C3.5 15 3 13.6 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" /></svg>}
        </button>
      </div>
    </div>
  );
}
