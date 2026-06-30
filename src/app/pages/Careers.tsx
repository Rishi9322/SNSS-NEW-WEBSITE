import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { FadeIn } from "../components/FadeIn";
import { NAVY, AMBER, EMPLOYEE_BENEFITS } from "../constants";
import { useSEO } from "../hooks/useSEO";

const ROLES = [
  "Housekeeping Supervisor", "Pantry / Cafeteria Staff", "Electrician (ITI Certified)",
  "Plumber", "Car Driver (LMV / HMV)", "Security Guard", "Data Entry Operator",
  "Account Manager (Client Services)", "HR Executive", "Other",
];

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export function Careers() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useSEO({
    title: "Careers at SNSS Global Services — Join 700+ Professionals Across India",
    description: "Join SNSS Global Services. We hire housekeeping supervisors, pantry staff, drivers, electricians, security personnel, and data entry operators across Mumbai, Pune, Ahmedabad, and Bhopal. PF, ESIC, and salary by the 7th guaranteed.",
    path: "/careers",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_honey")) return;
    setSubmitting(true);
    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("subject", "New job application — SNSS Global Services website");
    data.append("from_name", "SNSS Careers Form");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        form.reset();
        setSelectedRole("");
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        setError(result.message || "Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { borderColor: "rgba(15,42,74,0.15)", background: "#fff", color: NAVY, borderRadius: "4px" };

  return (
    <>
      <div className="py-16 lg:py-20" style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>
            <Link to="/" className="transition-opacity hover:opacity-70">Home</Link>
            <span className="mx-2 opacity-30">/</span>Careers
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.025em" }}>
            Join 700+ professionals<br />across India.
          </h1>
          <p className="max-w-xl text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
            Every employee receives a complete benefits package from day one — appointment letter, PF, ESIC, salary by the 7th. No delays, no exceptions.
          </p>
        </div>
      </div>

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Benefits */}
            <FadeIn>
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-8" style={{ color: AMBER }}>What every SNSS employee receives</p>
                <ul className="space-y-0">
                  {EMPLOYEE_BENEFITS.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-4 py-4" style={{ borderBottom: "1px solid rgba(15,42,74,0.08)" }}>
                      <svg viewBox="0 0 16 16" fill="none" stroke={AMBER} strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><path d="M3 8l3.5 3.5L13 5" /></svg>
                      <span className="text-sm font-medium" style={{ color: NAVY }}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Application */}
            <FadeIn delay={0.1}>
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>Actively hiring</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {ROLES.map((role) => (
                    <button key={role} onClick={() => setSelectedRole(role === selectedRole ? "" : role)} className="px-3 py-1.5 text-xs font-medium transition-all" style={{ background: selectedRole === role ? NAVY : "rgba(15,42,74,0.06)", color: selectedRole === role ? "#fff" : NAVY, border: selectedRole === role ? `1px solid ${NAVY}` : "1px solid rgba(15,42,74,0.1)", borderRadius: "3px" }}>
                      {role}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="p-7" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>Full Name *</label>
                      <input name="fullName" type="text" required placeholder="Your full name" className="w-full px-4 py-3 border text-sm focus:outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>Phone *</label>
                      <input name="phone" type="tel" required placeholder="+91 98000 00000" className="w-full px-4 py-3 border text-sm focus:outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>City *</label>
                      <select name="city" required className="w-full px-4 py-3 border text-sm focus:outline-none appearance-none" style={inputStyle}>
                        <option value="">Select city</option>
                        {["Mumbai", "Pune", "Ahmedabad", "Bhopal", "Other"].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>Role *</label>
                      <select name="role" required value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full px-4 py-3 border text-sm focus:outline-none appearance-none" style={inputStyle}>
                        <option value="">Select role</option>
                        {ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>Experience *</label>
                      <select name="experience" required className="w-full px-4 py-3 border text-sm focus:outline-none appearance-none" style={inputStyle}>
                        <option value="">Select range</option>
                        {["Fresher (0–1 years)", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>How did you hear?</label>
                      <select name="source" className="w-full px-4 py-3 border text-sm focus:outline-none appearance-none" style={inputStyle}>
                        <option value="">Select source</option>
                        {["Job board", "WhatsApp / Referral", "SNSS employee", "Walk-in", "Other"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="hidden" aria-hidden="true"><input type="text" name="_honey" tabIndex={-1} autoComplete="off" /></div>

                  <AnimatePresence>
                    {submitted && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 px-4 py-3 text-sm font-medium" style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "4px" }}>
                        ✓ Application submitted. Our HR team will contact you within 2 business days.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 px-4 py-3 text-sm font-medium" style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "4px" }}>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={submitting} className="w-full py-3.5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60" style={{ background: NAVY, borderRadius: "4px" }}>
                    {submitting ? "Sending…" : "Submit Application"}
                  </button>
                  <p className="text-center text-xs mt-3" style={{ color: "rgba(15,42,74,0.4)" }}>
                    Or email your resume to{" "}
                    <a href="mailto:INFO@SNSSGROUP.COM" className="underline">INFO@SNSSGROUP.COM</a>
                  </p>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="py-16" style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-12" style={{ color: AMBER }}>Why work at SNSS</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0" style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
            {[
              { label: "Stability", desc: "25+ years in operation. Your employment is secure." },
              { label: "Timely Salary", desc: "Salary to your bank account by the 7th, every month." },
              { label: "Legal Protection", desc: "PF, ESIC, PT, police verification — all handled from day one." },
              { label: "Growth", desc: "Field staff become supervisors. Supervisors become managers." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="p-7" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                  <div className="font-bold text-white mb-2">{item.label}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
