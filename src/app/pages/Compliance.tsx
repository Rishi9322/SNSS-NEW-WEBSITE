import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { FadeIn } from "../components/FadeIn";
import { NAVY, AMBER, REGISTRATIONS, LABOUR_COMPLIANCE, GEM_CONTRACTS, ISO_CERTS } from "../constants";
import { useSEO } from "../hooks/useSEO";

type Tab = "registrations" | "labour" | "iso" | "gem" | "financial";

const TABS: { key: Tab; label: string }[] = [
  { key: "registrations", label: "Company Registrations" },
  { key: "labour", label: "Labour Compliance" },
  { key: "iso", label: "ISO Certifications" },
  { key: "gem", label: "GeM Contracts" },
  { key: "financial", label: "Financial Standing" },
];

function RegTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="overflow-hidden" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
      <div className="grid grid-cols-2 text-xs font-bold py-3 px-6 tracking-wider uppercase" style={{ background: NAVY, color: "white" }}>
        <div>Registration</div><div>Number</div>
      </div>
      {rows.map((r, i) => (
        <div key={r.label} className="grid grid-cols-2 text-sm py-4 px-6" style={{ borderTop: "1px solid rgba(15,42,74,0.07)", background: i % 2 === 1 ? "rgba(15,42,74,0.02)" : "#fff" }}>
          <div className="font-semibold" style={{ color: NAVY }}>{r.label}</div>
          <div className="font-mono break-all" style={{ color: "rgba(15,42,74,0.7)" }}>{r.value}</div>
        </div>
      ))}
    </div>
  );
}

export function Compliance() {
  const [activeTab, setActiveTab] = useState<Tab>("registrations");

  useSEO({
    title: "Compliance Resource Centre — ISO Certs, GeM Contracts & Registrations",
    description: "View SNSS Global Services' full compliance credentials: ISO 9001/14001/45001/27001 certifications, EPFO/ESIC registrations, GeM contract history, GST, MSME Udyam, and DIPP Startup India.",
    path: "/compliance",
  });

  return (
    <>
      <div className="py-16 lg:py-20" style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>
            <Link to="/" className="transition-opacity hover:opacity-70">Home</Link>
            <span className="mx-2 opacity-30">/</span>Compliance
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.025em" }}>
            Every credential.<br />One place.
          </h1>
          <p className="max-w-2xl text-sm mb-5" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
            For procurement officers: all registration numbers, ISO certifications, GeM contracts, and financial standing — verified and ready.
          </p>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
            Last verified: 12 June 2026
          </p>
        </div>
      </div>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            {/* Tab nav */}
            <div className="flex flex-wrap gap-1 p-1" style={{ background: "rgba(15,42,74,0.05)", borderRadius: "6px" }}>
              {TABS.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="px-4 py-2 text-sm font-bold transition-all duration-200" style={{ background: activeTab === tab.key ? NAVY : "transparent", color: activeTab === tab.key ? "#fff" : "rgba(15,42,74,0.5)", borderRadius: "4px" }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <Link to="/contact" className="flex-shrink-0 px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110" style={{ background: AMBER, borderRadius: "4px" }}>
              Request Documents
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "registrations" && (
              <motion.div key="reg" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <RegTable rows={REGISTRATIONS} />
              </motion.div>
            )}
            {activeTab === "labour" && (
              <motion.div key="lab" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <RegTable rows={LABOUR_COMPLIANCE} />
              </motion.div>
            )}
            {activeTab === "iso" && (
              <motion.div key="iso" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ISO_CERTS.map((cert, i) => (
                    <div key={cert.standard} className="p-6" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px", borderTop: i === 0 ? `3px solid ${AMBER}` : undefined }}>
                      <div className="font-extrabold text-sm mb-1" style={{ color: AMBER }}>{cert.standard}</div>
                      <div className="font-bold text-sm mb-2" style={{ color: NAVY }}>{cert.name}</div>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(15,42,74,0.6)" }}>{cert.scope}</p>
                      <div className="text-xs font-semibold" style={{ color: "rgba(15,42,74,0.35)" }}>Certificate available on request</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === "gem" && (
              <motion.div key="gem" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div className="overflow-x-auto" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: NAVY, color: "white" }}>
                        <th className="text-left py-3 px-5 text-xs font-bold uppercase tracking-wider">Institution</th>
                        <th className="text-left py-3 px-5 text-xs font-bold uppercase tracking-wider">Ministry</th>
                        <th className="text-center py-3 px-5 text-xs font-bold uppercase tracking-wider">Staff</th>
                        <th className="text-left py-3 px-5 text-xs font-bold uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {GEM_CONTRACTS.map((row, i) => (
                        <tr key={i} style={{ borderTop: "1px solid rgba(15,42,74,0.07)", background: i % 2 === 1 ? "rgba(15,42,74,0.02)" : "#fff" }}>
                          <td className="py-4 px-5 font-semibold" style={{ color: NAVY }}>{row.institution}</td>
                          <td className="py-4 px-5 text-xs" style={{ color: "rgba(15,42,74,0.6)" }}>{row.ministry}</td>
                          <td className="py-4 px-5 text-center font-bold" style={{ color: NAVY }}>{row.staff}</td>
                          <td className="py-4 px-5 font-bold" style={{ color: AMBER }}>{row.value}</td>
                        </tr>
                      ))}
                      <tr style={{ borderTop: `2px solid ${NAVY}`, background: "rgba(15,42,74,0.03)" }}>
                        <td className="py-4 px-5 font-bold" style={{ color: NAVY }}>Total — 6 active contracts</td>
                        <td />
                        <td className="py-4 px-5 text-center font-bold" style={{ color: NAVY }}>58</td>
                        <td className="py-4 px-5 font-bold" style={{ color: AMBER }}>₹2.04 Cr+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 p-5" style={{ background: "rgba(15,42,74,0.03)", border: "1px solid rgba(15,42,74,0.08)", borderRadius: "4px" }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: NAVY }}>Work Completion Record</div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { org: "Sports Authority of India", note: "8+ years continuous service" },
                      { org: "Shirdi Saibaba Trust", note: "₹5.03 Cr work completion certificate" },
                      { org: "Thermo Fisher Scientific", note: "₹9.83 Cr work completion certificate" },
                    ].map((item) => (
                      <div key={item.org} className="p-4 bg-white" style={{ border: "1px solid rgba(15,42,74,0.09)", borderRadius: "3px" }}>
                        <div className="font-bold text-sm mb-0.5" style={{ color: NAVY }}>{item.org}</div>
                        <div className="text-xs" style={{ color: "rgba(15,42,74,0.55)" }}>{item.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "financial" && (
              <motion.div key="fin" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div className="grid sm:grid-cols-3 gap-0 overflow-hidden mb-5" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
                  {[
                    { label: "3-Year Turnover", value: "₹55.10 Cr", note: "Verify against current FY25-26 records" },
                    { label: "Annual Average", value: "₹18.36 Cr", note: "Based on 3-year consolidated turnover" },
                    { label: "Solvency Certificate", value: "₹1.00 Cr", note: "Issued by State Bank of India" },
                  ].map((item, i) => (
                    <div key={item.label} className="p-7" style={{ borderRight: i < 2 ? "1px solid rgba(15,42,74,0.1)" : "none" }}>
                      <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(15,42,74,0.4)" }}>{item.label}</div>
                      <div className="font-extrabold mb-1" style={{ fontSize: "2rem", color: NAVY, lineHeight: 1, letterSpacing: "-0.02em" }}>{item.value}</div>
                      <div className="text-xs" style={{ color: "rgba(15,42,74,0.5)" }}>{item.note}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm p-4" style={{ background: "rgba(232,135,26,0.07)", border: "1px solid rgba(232,135,26,0.2)", color: "#5a4010", borderRadius: "4px" }}>
                  <strong>Note:</strong> Verify against current SNSS Accounts records before publishing. Replace with updated FY25-26 turnover when available.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Procurement CTA */}
      <FadeIn>
        <section className="py-14" style={{ background: NAVY }}>
          <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: AMBER }}>For Procurement Officers</p>
              <h2 className="text-white font-bold mb-2" style={{ fontSize: "1.3rem", letterSpacing: "-0.01em" }}>Need a document package for a tender?</h2>
              <p className="text-sm max-w-lg" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                We'll prepare a compliance pack with ISO certificates, registration extracts, and GeM contract references — tailored to your tender requirements.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link to="/contact" className="px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110" style={{ background: AMBER, borderRadius: "4px" }}>Request Document Pack</Link>
              <a href="https://wa.me/918655362161" target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-sm font-bold transition-all hover:bg-white/10" style={{ color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px" }}>WhatsApp Us</a>
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
