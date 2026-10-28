import { useState } from "react";
import { useNavigate } from "react-router";
import { SERVICES } from "../constants";

/** Service codes double as room codes on the plan and in the legend. */
export const ZONES = [
  { slug: "housekeeping", code: "HK", x: 10, y: 10, w: 300, h: 210 },
  { slug: "pantry", code: "PN", x: 310, y: 10, w: 200, h: 110 },
  { slug: "technical", code: "TM", x: 310, y: 120, w: 200, h: 100 },
  { slug: "data-entry", code: "DE", x: 10, y: 220, w: 170, h: 190 },
  { slug: "payroll", code: "PR", x: 180, y: 220, w: 170, h: 190 },
  { slug: "staffing", code: "ST", x: 350, y: 220, w: 160, h: 190 },
] as const;

type Props = { active: string | null; onActive: (slug: string | null) => void };

/** A single floor drawn in ink: every room is a service Sentinel runs. Draws in once on load (see .plan-draw in globals.css). */
export function CoveragePlan({ active, onActive }: Props) {
  const navigate = useNavigate();
  const [focused, setFocused] = useState<string | null>(null); // keyboard focus ring (the g element cannot show an outline)
  return (
    <svg viewBox="0 0 520 420" role="group" aria-label="Floor plan showing the six services Sentinel runs in one building. Each room links to its service." className="h-auto w-full">
      {ZONES.map((z, i) => {
        const svc = SERVICES.find((s) => s.slug === z.slug);
        const on = active === z.slug;
        const go = () => navigate(`/services/${z.slug}`);
        return (
          <g
            key={z.slug}
            role="link"
            tabIndex={0}
            aria-label={svc?.title ?? z.slug}
            onMouseEnter={() => onActive(z.slug)}
            onMouseLeave={() => onActive(null)}
            onFocus={(e) => { onActive(z.slug); if (e.currentTarget.matches(":focus-visible")) setFocused(z.slug); }}
            onBlur={() => { onActive(null); setFocused(null); }}
            onClick={go}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }}
            className="cursor-pointer outline-none"
          >
            <rect x={z.x} y={z.y} width={z.w} height={z.h} fill={on ? "var(--color-hivis)" : "#fff"} style={{ transition: "fill 140ms" }} />
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h} fill="none" stroke="var(--color-ink)" strokeWidth={3} pathLength={1}
              className="plan-draw" style={{ animationDelay: `${i * 120}ms` }}
            />
            {focused === z.slug && (
              <>
                <rect x={z.x + 3} y={z.y + 3} width={z.w - 6} height={z.h - 6} fill="none" stroke="var(--color-ink)" strokeWidth={8} />
                <rect x={z.x + 3} y={z.y + 3} width={z.w - 6} height={z.h - 6} fill="none" stroke="var(--color-hivis)" strokeWidth={4} />
              </>
            )}
            <text x={z.x + 16} y={z.y + 46} className="display" fontSize={z.w > 250 ? 50 : 40} fill="var(--color-ink)" style={{ fontStretch: "82%" }}>{z.code}</text>
            <text x={z.x + 16} y={z.y + (z.w > 250 ? 76 : 72)} fontSize={21} fontWeight={600} fill="var(--color-ink)">{svc?.shortTitle}</text>
          </g>
        );
      })}

      {/* Entrance and security post: the one thing every site has in common. */}
      <rect x={398} y={402} width={64} height={16} fill="var(--color-hivis)" stroke="var(--color-ink)" strokeWidth={3} />
      <text x={430} y={414} textAnchor="middle" fontSize={10} fontWeight={800} fill="var(--color-ink)">ENTRY</text>
    </svg>
  );
}
