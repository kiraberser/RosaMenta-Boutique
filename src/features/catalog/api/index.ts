import { fetchAPI } from "@shared/lib/api";

import type {
  CatalogoFilters,
  Categoria,
  Marca,
  Paginated,
  ProductoDetalle,
  ProductoListItem,
} from "../types";

function buildQuery(filters: CatalogoFilters = {}): string {
  const params = new URLSearchParams();
  params.set("activo", "true");
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.marca) params.set("marca", filters.marca);
  if (filters.estado) params.set("estado", filters.estado);
  if (filters.destacado != null) params.set("destacado", String(filters.destacado));
  if (filters.search) params.set("search", filters.search);
  if (filters.ordering) params.set("ordering", filters.ordering);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getProductos(
  filters: CatalogoFilters = {},
): Promise<Paginated<ProductoListItem>> {
  return fetchAPI<Paginated<ProductoListItem>>(
    `/catalogo/productos/${buildQuery(filters)}`,
    { auth: false, revalidate: 300, tags: ["productos"] },
  );
}

export async function getProducto(id: number | string): Promise<ProductoDetalle> {
  return fetchAPI<ProductoDetalle>(`/catalogo/productos/${id}/`, {
    auth: false,
    revalidate: 300,
    tags: ["productos", `producto:${id}`],
  });
}

export async function getCategorias(): Promise<Categoria[]> {
  const data = await fetchAPI<Paginated<Categoria>>(
    "/catalogo/categorias/?page_size=200",
    { auth: false, revalidate: 3600, tags: ["categorias"] },
  );
  return data.results ?? [];
}

export async function getMarcas(): Promise<Marca[]> {
  const data = await fetchAPI<Paginated<Marca>>(
    "/catalogo/marcas/?page_size=200",
    { auth: false, revalidate: 3600, tags: ["marcas"] },
  );
  return data.results ?? [];
}

export async function getDestacados(limit = 8): Promise<ProductoListItem[]> {
  const data = await getProductos({ destacado: true, ordering: "-created_at" });
  return data.results.slice(0, limit);
}
