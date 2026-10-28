import { useState } from "react";
import { Container, PageHeader, SectionTitle } from "../components/kit";
import { EMPLOYEE_BENEFITS } from "../constants";
import { useSEO } from "../hooks/useSEO";
import careersHeroImage from "../../assets/images/careers-hero.webp";

const ROLES = [
  "Housekeeping Supervisor", "Pantry / Cafeteria Staff", "Electrician (ITI Certified)",
  "Plumber", "Car Driver (LMV / HMV)", "Security Guard", "Data Entry Operator",
  "Account Manager (Client Services)", "HR Executive", "Other",
];

const WHY = [
  { label: "Stability", desc: "25+ years in operation. Your employment is secure." },
  { label: "Timely Salary", desc: "Salary to your bank account by the 7th, every month." },
  { label: "Legal Protection", desc: "PF, ESIC, PT, police verification — all handled from day one." },
  { label: "Growth", desc: "Field staff become supervisors. Supervisors become managers." },
];

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

const field = "h-12 w-full rounded-[4px] border-2 border-ink/40 bg-white px-4 text-[16px] text-ink focus:border-ink";
const label = "mb-2 block text-[15px] font-bold text-ink";

export function Careers() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useSEO({
    title: "Careers at Sentinel IFM — Join 700+ Professionals Across India",
    description: "Join Sentinel IFM. We hire housekeeping supervisors, pantry staff, drivers, electricians, security personnel, and data entry operators across Mumbai, Pune, Ahmedabad, and Bhopal. PF, ESIC, and salary by the 7th guaranteed.",
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
    data.append("subject", "New job application — Sentinel IFM website");
    data.append("from_name", "Sentinel Careers Form");
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

  return (
    <>
      <PageHeader
        path={[{ label: "Home", to: "/" }, { label: "Careers" }]}
        title="Join 700+ professionals across India."
        lede="Every employee receives a complete benefits package from day one — appointment letter, PF, ESIC, salary by the 7th. No delays, no exceptions."
        image={careersHeroImage}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionTitle title="What every Sentinel employee receives" />
            <ul className="mt-8 border-t-2 border-ink">
              {EMPLOYEE_BENEFITS.map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 border-b border-ink/20 py-4">
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5 shrink-0 text-go"><path d="M3 8l3.5 3.5L13 5" /></svg>
                  <span className="text-[16px] font-semibold text-ink">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="display text-[clamp(1.6rem,3.2vw,2.4rem)] text-ink">Actively hiring</h2>
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Open roles">
              {ROLES.map((role) => {
                const on = selectedRole === role;
                return (
                  <button
                    type="button"
                    key={role}
                    aria-pressed={on}
                    onClick={() => setSelectedRole(on ? "" : role)}
                    className={`min-h-[44px] rounded-[4px] border-2 border-ink px-4 text-[15px] font-semibold transition-colors ${on ? "bg-ink text-white" : "bg-white text-ink hover:bg-hivis"}`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 rounded-[10px] border-2 border-ink bg-concrete p-5 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={label}>Full name (required)</label>
                  <input id="c-name" name="fullName" type="text" required autoComplete="name" placeholder="Your full name" className={field} />
                </div>
                <div>
                  <label htmlFor="c-phone" className={label}>Phone (required)</label>
                  <input id="c-phone" name="phone" type="tel" required autoComplete="tel" placeholder="+91 98000 00000" className={field} />
                </div>
                <div>
                  <label htmlFor="c-city" className={label}>City (required)</label>
                  <select id="c-city" name="city" required className={field}>
                    <option value="">Select city</option>
                    {["Mumbai", "Pune", "Ahmedabad", "Bhopal", "Other"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-role" className={label}>Role (required)</label>
                  <select id="c-role" name="role" required value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className={field}>
                    <option value="">Select role</option>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-exp" className={label}>Experience (required)</label>
                  <select id="c-exp" name="experience" required className={field}>
                    <option value="">Select range</option>
                    {["Fresher (0–1 years)", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-src" className={label}>How did you hear about us?</label>
                  <select id="c-src" name="source" className={field}>
                    <option value="">Select source</option>
                    {["Job board", "WhatsApp / Referral", "Sentinel employee", "Walk-in", "Other"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="hidden" aria-hidden="true"><input type="text" name="_honey" tabIndex={-1} autoComplete="off" /></div>

              {submitted && (
                <p role="status" className="mt-5 rounded-[4px] border-2 border-go bg-white px-4 py-3 text-[16px] font-semibold text-ink">
                  Application submitted. Our HR team will contact you within 2 business days.
                </p>
              )}
              {error && (
                <p role="alert" className="mt-5 rounded-[4px] border-2 border-ink bg-hivis px-4 py-3 text-[16px] font-semibold text-ink">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-[4px] bg-hivis px-6 text-[16px] font-bold text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Submit Application"}
              </button>
              <p className="mt-4 text-[15px] text-steel">
                Or email your resume to{" "}
                <a href="mailto:info@sentinelifm.com" className="font-semibold text-ink underline underline-offset-4">info@sentinelifm.com</a>
              </p>
            </form>
          </div>
        </Container>
      </section>

      <section className="bg-concrete py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionTitle title="Why work at Sentinel" />
          <dl className="border-t-2 border-ink">
            {WHY.map((item) => (
              <div key={item.label} className="grid gap-1 border-b border-ink/20 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="font-bold text-ink">{item.label}</dt>
                <dd className="max-w-[56ch] text-[16px] leading-relaxed text-steel">{item.desc}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
