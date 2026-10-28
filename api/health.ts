import type { VercelRequest, VercelResponse } from "@vercel/node";

// Point a free uptime monitor (UptimeRobot, Better Stack) at /api/health. It returns 503 when the AI
// provider is unreachable, the key is rejected, or the configured model no longer exists, which is how
// the chat broke silently once already. Cached for 5 minutes so the endpoint cannot be used to hammer Groq.
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
let cache: { at: number; body: { ok: boolean; model: string; reason?: string } } | null = null;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const now = Date.now();
  if (!cache || now - cache.at > 300_000) {
    const key = process.env.GROQ_API_KEY;
    let body: { ok: boolean; model: string; reason?: string };
    if (!key) {
      body = { ok: false, model: MODEL, reason: "GROQ_API_KEY not set" };
    } else {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(8000) });
        if (!r.ok) body = { ok: false, model: MODEL, reason: `Groq returned ${r.status}` };
        else {
          const data = (await r.json()) as { data?: Array<{ id: string }> };
          body = data.data?.some((m) => m.id === MODEL) ? { ok: true, model: MODEL } : { ok: false, model: MODEL, reason: "configured model is not available" };
        }
      } catch {
        body = { ok: false, model: MODEL, reason: "Groq unreachable" };
      }
    }
    cache = { at: now, body };
  }
  res.setHeader("Cache-Control", "no-store");
  return res.status(cache.body.ok ? 200 : 503).json(cache.body);
}
