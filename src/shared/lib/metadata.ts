import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_URL } from "@shared/lib/site";

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image = `${SITE_URL}/og`,
  type = "website",
  noIndex = false,
}: BuildMetadataInput = {}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const resolvedTitle = title ?? `${SITE_NAME} — Boutique de moda`;

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      type,
      locale: SITE_LOCALE.replace("-", "_"),
      url,
      siteName: SITE_NAME,
      title: resolvedTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [image],
    },
  };
}

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export function jsonLdScript(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og`,
    image: `${SITE_URL}/og`,
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressCountry: "MX",
    },
    priceRange: "$$",
  };
}

export type BreadcrumbItem = { name: string; href: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.href, SITE_URL).toString(),
    })),
  };
}

export function ogImageUrl(params: { title: string; eyebrow?: string }): string {
  const qs = new URLSearchParams({ title: params.title });
  if (params.eyebrow) qs.set("eyebrow", params.eyebrow);
  return `${SITE_URL}/og?${qs.toString()}`;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/catalogo?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
