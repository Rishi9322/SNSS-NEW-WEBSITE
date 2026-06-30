import { useEffect } from "react";

const BASE_URL = "https://www.snssgroup.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

interface SEOOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSEO({ title, description, path, image = DEFAULT_IMAGE }: SEOOptions) {
  useEffect(() => {
    const fullTitle = title.includes("SNSS") ? title : `${title} | SNSS Global Services`;
    document.title = fullTitle;
    const canonical = `${BASE_URL}${path}`;

    setMeta("description", description);
    setLink("canonical", canonical);

    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:image", image, "property");

    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
  }, [title, description, path, image]);
}
