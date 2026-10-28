import { Link } from "react-router";
import { SERVICES } from "../constants";
import { ZONES } from "../components/CoveragePlan";
import { Code, Container, CtaBand, PageHeader } from "../components/kit";
import { useSEO } from "../hooks/useSEO";

export function Services() {
  useSEO({
    title: "Facilities Management Services — Housekeeping, Pantry, Technical, Payroll & Staffing",
    description: "Sentinel offers six integrated facilities management services: housekeeping, pantry management, electrical & technical maintenance, data entry, payroll compliance, and contract staffing across India.",
    path: "/services",
  });

  return (
    <>
      <PageHeader
        path={[{ label: "Home", to: "/" }, { label: "Services" }]}
        title={<>Six services.<br />Zero coordination overhead.</>}
        lede="Most facilities teams manage three to five vendors for the same building. Sentinel consolidates all of it — housekeeping, pantry, technical, payroll, staffing — under a single contract and a single point of accountability. That is the actual value: not any individual service, but the fact that you stop chasing vendors."
      />

      <section className="bg-concrete py-12 lg:py-20">
        <Container>
          <ul className="border-t-2 border-ink">
            {SERVICES.map((svc) => {
              const code = ZONES.find((z) => z.slug === svc.slug)?.code ?? "";
              return (
                <li key={svc.id} className="grid gap-4 border-b border-ink/25 py-8 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-8">
                  <Code>{code}</Code>
                  <div>
                    <h2 className="display text-[clamp(1.6rem,3.4vw,2.4rem)] text-ink">{svc.title}</h2>
                    <p className="mt-1 text-[15px] text-steel">{svc.industries}</p>
                    <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-steel">{svc.desc}</p>
                  </div>
                  <Link to={`/services/${svc.slug}`} className="inline-flex min-h-[44px] items-center font-bold text-ink underline underline-offset-4 decoration-2 hover:bg-hivis">
                    View {svc.shortTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <CtaBand
        title="Not sure what you need?"
        text="Most clients come to us with a problem, not a service name. Tell us what's causing friction — we'll recommend the right combination and quote within 4 business hours."
        primary={{ label: "Talk to our team", to: "/contact" }}
        secondary={{ label: "WhatsApp Us", href: "https://wa.me/918655362161" }}
      />
    </>
  );
}
