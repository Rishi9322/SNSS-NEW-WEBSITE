import { Link } from "react-router";
import { NAVY, AMBER } from "../constants";

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
      <div className="font-extrabold mb-4" style={{ fontSize: "6rem", color: "rgba(15,42,74,0.08)", lineHeight: 1 }}>404</div>
      <h1 className="font-bold mb-3" style={{ fontSize: "1.8rem", color: NAVY }}>Page Not Found</h1>
      <p className="text-sm mb-8 max-w-sm" style={{ color: "#5a6a7a", lineHeight: 1.7 }}>
        The page you're looking for doesn't exist. You might have followed an old link or typed the URL incorrectly.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:brightness-110" style={{ background: NAVY }}>
          Back to Home
        </Link>
        <Link to="/contact" className="px-6 py-3 rounded-lg font-semibold border transition-all hover:bg-gray-50" style={{ color: NAVY, borderColor: "rgba(15,42,74,0.2)" }}>
          Contact Us
        </Link>
      </div>
      <div className="mt-10 pt-8 border-t w-full max-w-sm" style={{ borderColor: "rgba(15,42,74,0.1)" }}>
        <p className="text-xs mb-3" style={{ color: "#9aaabb" }}>Quick links</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "Services", to: "/services" },
            { label: "Compliance", to: "/compliance" },
            { label: "About", to: "/about" },
            { label: "Careers", to: "/careers" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-semibold transition-colors hover:underline" style={{ color: AMBER }}>{l.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
