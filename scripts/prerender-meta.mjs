// Post-build: writes dist/<route>/index.html with per-page <title>/description/canonical/OG tags,
// so crawlers and link-preview bots (which don't run JS) see the right metadata. The React app
// still mounts as usual. Static files win over Vercel's SPA rewrite, so no config is needed.
// ponytail: meta only, not full SSR — add vite-ssg/prerender if you need body text indexed without JS.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "../src/app/site.ts";

const dist = "dist";
const shell = readFileSync(join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Static pages: pull the useSEO({ title, description, path }) literals straight from the source.
const pages = [];
const pageDir = "src/app/pages";
const seoRe = /useSEO\(\{\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*path:\s*"([^"]+)"/;
for (const f of readdirSync(pageDir).filter((f) => f.endsWith(".tsx"))) {
  const m = readFileSync(join(pageDir, f), "utf8").match(seoRe);
  if (m) pages.push({ title: m[1], description: m[2], path: m[3] });
}

// Service pages: slug/title/subhead from constants.tsx, in declaration order.
const consts = readFileSync("src/app/constants.tsx", "utf8");
const slugs = [...consts.matchAll(/slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g)];
const subheads = [...consts.matchAll(/subhead:\s*"([^"]+)"/g)];
slugs.forEach((m, i) => {
  pages.push({ title: `${m[2]} | Sentinel IFM`, description: subheads[i]?.[1] ?? "", path: `/services/${m[1]}` });
});

const setTag = (html, re, tag) => (re.test(html) ? html.replace(re, () => tag) : html);

for (const p of pages) {
  const title = p.title.includes("Sentinel") ? p.title : `${p.title} | Sentinel IFM`;
  const url = `${SITE_URL}${p.path}`;
  let html = shell;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(p.description)}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(title)}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(p.description)}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${esc(p.description)}" />`);
  const dir = join(dist, p.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

// Sitemap: same URLs as public/sitemap.xml, with today's lastmod.
const today = new Date().toISOString().slice(0, 10);
const sitemap = readFileSync("public/sitemap.xml", "utf8").replace(/(<loc>[^<]*<\/loc>)/g, (m) => `${m}\n    <lastmod>${today}</lastmod>`);
writeFileSync(join(dist, "sitemap.xml"), sitemap);

console.log(`prerender-meta: ${pages.length} pages, sitemap lastmod ${today}`);
