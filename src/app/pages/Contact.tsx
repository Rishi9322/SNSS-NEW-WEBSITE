import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useSEO } from "../hooks/useSEO";
import { SERVICES } from "../constants";
import { Container, PageHeader } from "../components/kit";

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
    tag: "Service area",
    address: "Serving Pune metropolitan region\nand PCMC industrial corridor",
    mapEmbed: "https://maps.google.com/maps?q=Pune+Maharashtra+India&output=embed&z=12",
    mapsLink: "https://maps.google.com/?q=Pune+Maharashtra+India",
    hq: false,
  },
  {
    name: "Ahmedabad",
    tag: "Service area",
    address: "Serving Ahmedabad and the\nGujarat industrial belt",
    mapEmbed: "https://maps.google.com/maps?q=Ahmedabad+Gujarat+India&output=embed&z=12",
    mapsLink: "https://maps.google.com/?q=Ahmedabad+Gujarat+India",
    hq: false,
  },
  {
    name: "Bhopal",
    tag: "Service area",
    address: "Serving Bhopal and central\nIndia corporate clusters",
    mapEmbed: "https://maps.google.com/maps?q=Bhopal+Madhya+Pradesh+India&output=embed&z=12",
    mapsLink: "https://maps.google.com/?q=Bhopal+Madhya+Pradesh+India",
    hq: false,
  },
];

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="mt-1 h-5 w-5 shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
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

  useSEO({
    title: "Contact Sentinel IFM — Get a Free Quote",
    description: "Contact Sentinel IFM for a free quote on housekeeping, pantry, technical maintenance, payroll, or staffing. Offices in Mumbai, Pune, Ahmedabad, and Bhopal. Response within 4 business hours.",
    path: "/contact",
  });

  useEffect(() => { setSelectedService(preselected); }, [preselected]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("_honey")) return;

    setSubmitting(true);

    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("subject", "New enquiry — Sentinel IFM website");
    data.append("from_name", "Sentinel IFM Website");

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

  const field = "block w-full min-h-[48px] rounded-[4px] border-2 border-ink/40 bg-white px-4 py-3 text-[16px] text-ink placeholder:text-steel/70 focus:border-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-hivis";
  const label = "mb-2 block text-[15px] font-bold text-ink";
  const city = CITIES[activeCity];

  return (
    <>
      <PageHeader
        path={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        title="Request a free quote."
        lede="Every enquiry is reviewed by a real person. We respond within 4 business hours."
      />

      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-[1.2fr_1fr]">
            <form onSubmit={handleSubmit} className="rounded-[10px] border-2 border-ink p-6 sm:p-8" aria-label="Enquiry form" noValidate>
              <div className="mb-5 grid gap-5 sm:grid-cols-2">
                {[
                  { name: "fullName", label: "Full name", type: "text", placeholder: "Rajesh Kumar", required: true },
                  { name: "company", label: "Company name", type: "text", placeholder: "Acme Pvt. Ltd.", required: false },
                  { name: "email", label: "Email address", type: "email", placeholder: "rajesh@company.com", required: true },
                  { name: "phone", label: "Phone number", type: "tel", placeholder: "+91 98000 00000", required: true },
                ].map((f) => (
                  <div key={f.name}>
                    <label htmlFor={`field-${f.name}`} className={label}>{f.label}{f.required && <span aria-hidden="true"> *</span>}{f.required && <span className="sr-only"> (required)</span>}</label>
                    <input id={`field-${f.name}`} name={f.name} type={f.type} required={f.required} placeholder={f.placeholder} aria-required={f.required ? "true" : "false"} className={field} />
                  </div>
                ))}
                <div>
                  <label htmlFor="field-city" className={label}>City <span aria-hidden="true">*</span></label>
                  <select id="field-city" name="city" required className={field}>
                    <option value="">Select city</option>
                    {["Mumbai", "Pune", "Ahmedabad", "Bhopal", "Other"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="field-service" className={label}>Service required <span aria-hidden="true">*</span></label>
                  <select id="field-service" name="service" required value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className={field}>
                    <option value="">Select service</option>
                    {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="field-source" className={label}>How did you hear about us? <span aria-hidden="true">*</span></label>
                <select id="field-source" name="source" required className={field}>
                  <option value="">Select source</option>
                  {["Google Search", "Referral / Word of mouth", "GeM portal", "Tender document", "Other"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="field-message" className={label}>Message</label>
                <textarea id="field-message" name="message" rows={4} placeholder="Briefly describe your facility, headcount, and specific requirements..." maxLength={1000} className={`${field} resize-y`} />
              </div>

              <div className="hidden" aria-hidden="true"><input type="text" name="_honey" tabIndex={-1} autoComplete="off" /></div>

              {submitted && (
                <div role="status" aria-live="polite" className="mb-4 rounded-[4px] border-2 border-go bg-white px-4 py-3 text-[16px] font-semibold text-ink">
                  Quote request received. We'll respond within 4 business hours.
                </div>
              )}

              {error && (
                <div role="alert" aria-live="assertive" className="mb-4 rounded-[4px] border-2 border-ink bg-hivis px-4 py-3 text-[16px] font-semibold text-ink">
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting} className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[4px] bg-hivis px-6 text-[16px] font-bold text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Sending…" : "Send quote request"}
              </button>
            </form>

            <div>
              <a href="mailto:info@sentinelifm.com" className="display block break-all text-[clamp(1.5rem,3.2vw,2.2rem)] text-ink underline decoration-2 underline-offset-4 hover:bg-hivis">info@sentinelifm.com</a>
              <a href="https://wa.me/919819301704" target="_blank" rel="noopener noreferrer" className="display mt-2 block text-[clamp(1.5rem,3.2vw,2.2rem)] text-ink underline decoration-2 underline-offset-4 hover:bg-hivis">+91 98193 01704</a>
              <p className="mt-1 text-[15px] text-steel">Email or WhatsApp</p>

              <h2 className="display mt-12 text-2xl text-ink">Our offices</h2>
              <ul className="mt-3 border-t-2 border-ink">
                {CITIES.map((c, i) => (
                  <li key={c.name} className="border-b border-ink/25">
                    <button
                      type="button"
                      onClick={() => setActiveCity(i)}
                      aria-pressed={activeCity === i}
                      className={`flex min-h-[48px] w-full items-center justify-between gap-4 px-3 py-3 text-left transition-colors ${activeCity === i ? "bg-hivis text-ink" : "text-ink hover:bg-concrete"}`}
                    >
                      <span className="display text-xl">{c.name}</span>
                      <span className="text-[15px] font-semibold">{c.tag}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 overflow-hidden rounded-[10px] border-2 border-ink">
                <iframe
                  key={city.name}
                  title={`Map of ${city.name}`}
                  src={city.mapEmbed}
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="border-t-2 border-ink bg-concrete p-5">
                  <div className="flex items-start gap-2 text-ink">
                    <MapPinIcon />
                    <p className="whitespace-pre-line text-[16px] leading-relaxed">{city.address}</p>
                  </div>
                  <a href={city.mapsLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-[44px] items-center font-bold text-ink underline underline-offset-4 decoration-2">
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
