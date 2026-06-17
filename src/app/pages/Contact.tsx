import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { FadeIn } from "../components/FadeIn";
import { NAVY, AMBER, SERVICES } from "../constants";

const CITIES = [
  {
    name: "Mumbai",
    tag: "Corporate Office",
    address: "409, Sej Plaza, Marve Road,\nMalad (W), Mumbai – 400064",
    mapEmbed: "https://maps.google.com/maps?q=Sej+Plaza+Marve+Road+Malad+West+Mumbai+400064&output=embed&z=16",
    mapsLink: "https://maps.google.com/?q=409+Sej+Plaza+Marve+Road+Malad+West+Mumbai+400064",
    hq: true,
  },
  {
    name: "Pune",
    tag: "Branch Office",
    address: "Serving Pune metropolitan region\nand PCMC industrial corridor",
    mapEmbed: "https://maps.google.com/maps?q=Pune+Maharashtra+India&output=embed&z=12",
    mapsLink: "https://maps.google.com/?q=Pune+Maharashtra+India",
    hq: false,
  },
  {
    name: "Ahmedabad",
    tag: "Branch Office",
    address: "Serving Ahmedabad and the\nGujarat industrial belt",
    mapEmbed: "https://maps.google.com/maps?q=Ahmedabad+Gujarat+India&output=embed&z=12",
    mapsLink: "https://maps.google.com/?q=Ahmedabad+Gujarat+India",
    hq: false,
  },
  {
    name: "Bhopal",
    tag: "Branch Office",
    address: "Serving Bhopal and central\nIndia corporate clusters",
    mapEmbed: "https://maps.google.com/maps?q=Bhopal+Madhya+Pradesh+India&output=embed&z=12",
    mapsLink: "https://maps.google.com/?q=Bhopal+Madhya+Pradesh+India",
    hq: false,
  },
];

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 flex-shrink-0">
    <path d="M6 3H3v10h10v-3M9 3h4v4M13 3l-6 6" />
  </svg>
);

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export function Contact() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("service") ?? "";
  const [selectedService, setSelectedService] = useState(preselected);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeCity, setActiveCity] = useState(0);

  useEffect(() => {
    document.title = "Contact & Get a Quote | SNSS Global Services";
    setSelectedService(preselected);
  }, [preselected]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("_honey")) return;

    setSubmitting(true);

    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("subject", "New enquiry — SNSS Global Services website");
    data.append("from_name", "SNSS Global Services Website");

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
        setSelectedService("");
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        setError(result.message || "Something went wrong. Please try again or call us directly.");
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
      {/* Page header */}
      <div className="py-16 lg:py-20" style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: AMBER }}>
            <Link to="/" className="transition-opacity hover:opacity-70">Home</Link>
            <span className="mx-2 opacity-30">/</span>Contact
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.025em" }}>
            Request a free quote.
          </h1>
          <p className="max-w-xl text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
            Every enquiry is reviewed by a real person and responded to within 4 business hours. No chatbots, no templates.
          </p>
        </div>
      </div>

      {/* Form + contact info */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-14 items-start">

            {/* Form */}
            <div className="lg:col-span-3">
              <FadeIn>
                <form onSubmit={handleSubmit} className="p-8" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { name: "fullName", label: "Full Name", type: "text", placeholder: "Rajesh Kumar", required: true },
                      { name: "company", label: "Company Name", type: "text", placeholder: "Acme Pvt. Ltd.", required: false },
                      { name: "email", label: "Email Address", type: "email", placeholder: "rajesh@company.com", required: true },
                      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98000 00000", required: true },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>{f.label}{f.required && " *"}</label>
                        <input name={f.name} type={f.type} required={f.required} placeholder={f.placeholder} className="w-full px-4 py-3 border text-sm focus:outline-none" style={inputStyle} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>City *</label>
                      <select name="city" required className="w-full px-4 py-3 border text-sm focus:outline-none appearance-none" style={inputStyle}>
                        <option value="">Select city</option>
                        {["Mumbai", "Pune", "Ahmedabad", "Bhopal", "Other"].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>Service Required *</label>
                      <select name="service" required value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full px-4 py-3 border text-sm focus:outline-none appearance-none" style={inputStyle}>
                        <option value="">Select service</option>
                        {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>How did you hear about us? *</label>
                    <select name="source" required className="w-full px-4 py-3 border text-sm focus:outline-none appearance-none" style={inputStyle}>
                      <option value="">Select source</option>
                      {["Google Search", "Referral / Word of mouth", "GeM portal", "Tender document", "Other"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: NAVY }}>Message</label>
                    <textarea name="message" rows={4} placeholder="Briefly describe your facility, headcount, and specific requirements..." maxLength={1000} className="w-full px-4 py-3 border text-sm focus:outline-none resize-none" style={inputStyle} />
                  </div>

                  <div className="hidden" aria-hidden="true"><input type="text" name="_honey" tabIndex={-1} autoComplete="off" /></div>

                  <AnimatePresence>
                    {submitted && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 px-4 py-3 text-sm font-medium" style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "4px" }}>
                        ✓ Enquiry received. We'll respond within 4 business hours.
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
                    {submitting ? "Sending…" : "Submit Enquiry"}
                  </button>
                </form>
              </FadeIn>
            </div>

            {/* Locations / contact info */}
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <div className="flex gap-2 mb-5 flex-wrap">
                  {CITIES.map((city, i) => (
                    <button
                      key={city.name}
                      onClick={() => setActiveCity(i)}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                      style={{
                        borderRadius: "4px",
                        background: activeCity === i ? NAVY : "transparent",
                        color: activeCity === i ? "#fff" : NAVY,
                        border: `1px solid ${activeCity === i ? NAVY : "rgba(15,42,74,0.15)"}`,
                      }}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>

                <div style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                  <iframe
                    key={CITIES[activeCity].name}
                    title={`Map of ${CITIES[activeCity].name}`}
                    src={CITIES[activeCity].mapEmbed}
                    className="w-full h-64 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="p-5">
                    <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: AMBER }}>
                      {CITIES[activeCity].tag}
                    </div>
                    <div className="flex items-start gap-2 mb-3" style={{ color: NAVY }}>
                      <MapPinIcon />
                      <p className="text-sm leading-relaxed whitespace-pre-line">{CITIES[activeCity].address}</p>
                    </div>
                    <a
                      href={CITIES[activeCity].mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70"
                      style={{ color: AMBER }}
                    >
                      Open in Google Maps
                      <ExternalLinkIcon />
                    </a>
                  </div>
                </div>

                <div className="mt-6 p-5" style={{ border: "1px solid rgba(15,42,74,0.1)", borderRadius: "4px" }}>
                  <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(15,42,74,0.4)" }}>Email</div>
                  <a href="mailto:INFO@SNSSGROUP.COM" className="text-sm font-bold transition-opacity hover:opacity-70" style={{ color: NAVY }}>INFO@SNSSGROUP.COM</a>
                  <div className="text-[10px] uppercase tracking-widest mb-1.5 mt-4" style={{ color: "rgba(15,42,74,0.4)" }}>WhatsApp</div>
                  <a href="https://wa.me/918655362161" target="_blank" rel="noopener noreferrer" className="text-sm font-bold transition-opacity hover:opacity-70" style={{ color: NAVY }}>+91 86553 62161</a>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
