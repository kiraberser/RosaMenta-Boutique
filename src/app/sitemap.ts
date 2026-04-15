import type { MetadataRoute } from "next";

import { fetchAPI } from "@shared/lib/api";
import { SITE_URL } from "@shared/lib/site";
import { productoHref, slugify } from "@shared/lib/slug";

export const revalidate = 3600;

type Paginated<T> = { results: T[]; next: string | null };
type ProductoLite = {
  id: number;
  sku: string;
  updated_at?: string;
  categoria?: { nombre?: string } | string;
};
type CategoriaLite = { id?: number; slug?: string; nombre?: string };

async function safeList<T>(endpoint: string): Promise<T[]> {
  try {
    const data = await fetchAPI<Paginated<T>>(endpoint, {
      auth: false,
      revalidate: 3600,
    });
    return data.results ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/registro`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [productos, categorias] = await Promise.all([
    safeList<ProductoLite>("/catalogo/productos/?activo=true&page_size=500"),
    safeList<CategoriaLite>("/catalogo/categorias/?page_size=200"),
  ]);

  const categoriaRoutes: MetadataRoute.Sitemap = categorias
    .map((c) => c.slug ?? (c.nombre ? slugify(c.nombre) : null))
    .filter((s): s is string => Boolean(s))
    .map((s) => ({
      url: `${SITE_URL}/catalogo/${s}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const productoRoutes: MetadataRoute.Sitemap = productos.map((p) => {
    const categoriaNombre =
      typeof p.categoria === "string"
        ? p.categoria
        : p.categoria?.nombre ?? "producto";
    return {
      url: `${SITE_URL}${productoHref({ id: p.id, categoria: categoriaNombre })}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...categoriaRoutes, ...productoRoutes];
}
