import { Link } from "react-router";
import type { ReactNode } from "react";

/** Shared building blocks for the Sentinel signage design system. Tokens live in src/styles/tailwind.css. */

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

type BtnProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: "primary" | "ghost" | "ghost-light";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
};

/** primary = hi-vis fill with ink text (9.9:1). ghost variants are outlined for use on light / dark surfaces. */
export function Btn({ children, to, href, variant = "primary", className = "", type = "button", onClick, disabled, external }: BtnProps) {
  const base =
    "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[4px] px-6 text-[15px] font-bold transition-[background,color,transform] duration-150 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed";
  const look = {
    primary: "bg-hivis text-ink hover:bg-white",
    ghost: "border-2 border-ink text-ink hover:bg-ink hover:text-white",
    "ghost-light": "border-2 border-white/70 text-white hover:bg-white hover:text-ink",
  }[variant];
  const cls = `${base} ${look} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

/** Two-letter room/service code, like the tag on a door plate. Purely functional: it names the service on the floor plan. */
export function Code({ children, tone = "hivis" }: { children: ReactNode; tone?: "hivis" | "ink" | "outline" }) {
  const t = { hivis: "bg-hivis text-ink", ink: "bg-ink text-white", outline: "border-2 border-ink text-ink" }[tone];
  return (
    <span aria-hidden="true" className={`display inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] text-[17px] ${t}`} style={{ letterSpacing: 0 }}>
      {children}
    </span>
  );
}

export type Crumb = { label: string; to?: string };

/** Page header: route path (real navigation), big condensed title, optional framed image. */
export function PageHeader({
  path, title, lede, image, imageAlt = "", imageRatio = 4 / 3, cropTop = 0, children,
}: {
  path: Crumb[]; title: ReactNode; lede?: ReactNode; image?: string; imageAlt?: string;
  /** width / height of the image file. The frame uses it, so the picture is never cropped at the sides. */
  imageRatio?: number;
  /** Fraction (0-1) of the image height to trim from the top, e.g. to hide text baked into the picture. */
  cropTop?: number;
  children?: ReactNode;
}) {
  const wide = !!image && imageRatio >= 2.3; // panoramic banners go full-width under the title
  return (
    <header className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2 bg-hivis" />
      <Container className={`grid gap-10 pb-16 pt-10 sm:pt-14 ${image && !wide ? "lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14" : ""}`}>
        <div>
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/75">
            <ol className="flex flex-wrap items-center gap-x-2">
              {path.map((c, i) => (
                <li key={c.label} className="flex items-center gap-x-2">
                  {i > 0 && <span aria-hidden="true" className="text-white/40">/</span>}
                  {c.to ? <Link to={c.to} className="underline-offset-4 hover:text-white hover:underline">{c.label}</Link> : <span aria-current="page" className="text-white">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="display max-w-[16ch] text-[clamp(2.6rem,7.2vw,5.4rem)]">{title}</h1>
          {lede && <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-white/80">{lede}</p>}
          {children}
        </div>
        {image && (
          <div className="relative">
            <div className="overflow-hidden rounded-[10px] border-2 border-white/20 bg-concrete" style={{ aspectRatio: imageRatio / (1 - cropTop) }}>
              <img src={image} alt={imageAlt} width={1200} height={Math.round(1200 / imageRatio)} decoding="async" className="h-full w-full object-cover" style={{ objectPosition: cropTop ? "bottom" : "center" }} />
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

/** Closing call to action: full-width hi-vis band. */
export function CtaBand({ title, text, primary, secondary }: { title: string; text?: string; primary: { label: string; to: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="bg-hivis text-ink">
      <Container className="flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <div className="max-w-[30ch]">
          <h2 className="display text-[clamp(2rem,4.6vw,3.4rem)]">{title}</h2>
          {text && <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed">{text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={primary.to} className="inline-flex min-h-[52px] items-center justify-center rounded-[4px] bg-ink px-7 text-[15px] font-bold text-white transition-colors hover:bg-white hover:text-ink">{primary.label}</Link>
          {secondary && <a href={secondary.href} className="inline-flex min-h-[52px] items-center justify-center rounded-[4px] border-2 border-ink px-7 text-[15px] font-bold transition-colors hover:bg-ink hover:text-white">{secondary.label}</a>}
        </div>
      </Container>
    </section>
  );
}

/** Section title: sentence-case display headline with an optional plain-language intro. No eyebrow labels. */
export function SectionTitle({ title, intro, light = false, className = "" }: { title: ReactNode; intro?: ReactNode; light?: boolean; className?: string }) {
  return (
    <div className={className}>
      <h2 className={`display max-w-[18ch] text-[clamp(2rem,4.8vw,3.6rem)] ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {intro && <p className={`mt-5 max-w-[60ch] text-[17px] leading-relaxed ${light ? "text-white/80" : "text-steel"}`}>{intro}</p>}
    </div>
  );
}
