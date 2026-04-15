export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "") || "item";
}

export function productoHref(params: {
  id: number | string;
  categoria: string;
}): string {
  return `/catalogo/${slugify(params.categoria)}/${params.id}`;
}
