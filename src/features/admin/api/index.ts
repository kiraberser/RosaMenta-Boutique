import { fetchAPI } from "@shared/lib/api";

import type {
  AdminDashboard,
  AdminPedido,
  AdminProducto,
  AdminUsuario,
  AdminVenta,
  Categoria,
  Marca,
  Movimiento,
  NewsletterMetrics,
  OrdenCompra,
  Paginated,
  Proveedor,
  Periodo,
  StockBajoItem,
  Suscriptor,
  TopProducto,
  VentasResumen,
} from "../types";

const NO_CACHE = { cache: "no-store" as const };

export async function getDashboard(): Promise<AdminDashboard> {
  return fetchAPI<AdminDashboard>("/reportes/dashboard/", NO_CACHE);
}

export async function getVentasResumen(
  periodo: Periodo = "mes",
): Promise<VentasResumen> {
  return fetchAPI<VentasResumen>(
    `/reportes/ventas/?periodo=${periodo}`,
    NO_CACHE,
  );
}

export async function getTopProductos(
  periodo: Periodo = "mes",
): Promise<{ top_por_cantidad: TopProducto[]; top_por_ingresos: TopProducto[] }> {
  return fetchAPI(`/reportes/top-productos/?periodo=${periodo}`, NO_CACHE);
}

export async function getStockBajo(): Promise<{ total: number; items: StockBajoItem[] }> {
  return fetchAPI("/reportes/stock-bajo/", NO_CACHE);
}

export async function getMovimientos(): Promise<{ total: number; items: Movimiento[] }> {
  return fetchAPI("/reportes/movimientos/", NO_CACHE);
}

export async function getNewsletterMetrics(): Promise<NewsletterMetrics> {
  return fetchAPI<NewsletterMetrics>("/reportes/newsletter/", NO_CACHE);
}

export async function getIngresosPorMetodo(periodo: Periodo = "mes") {
  return fetchAPI<{
    periodo: Periodo;
    desde: string;
    hasta: string;
    pedidos_online: { metodo_pago: string; transacciones: number; total: string }[];
    ventas_directas: { metodo_pago: string; transacciones: number; total: string }[];
  }>(`/reportes/ingresos-por-metodo/?periodo=${periodo}`, NO_CACHE);
}

export async function getProductoDetalle(id: number | string) {
  return fetchAPI<{
    id: number;
    nombre: string;
    descripcion: string;
    sku: string;
    precio: string;
    precio_descuento: string | null;
    precio_final: string;
    estado: string;
    activo: boolean;
    destacado: boolean;
    categoria: { id: number; nombre: string };
    marca: { id: number; nombre: string };
    imagenes: {
      id: number;
      imagen_url: string;
      orden: number;
      es_principal: boolean;
    }[];
    variantes: {
      id: number;
      talla: string;
      color: string;
      sku_variante: string;
      precio_extra: string;
      precio_final: string;
    }[];
  }>(`/catalogo/productos/${id}/`, NO_CACHE);
}

export async function getVentaDetalle(id: number | string) {
  return fetchAPI<{
    id: number;
    numero_ticket: string;
    fecha: string;
    vendedor: number;
    vendedor_username: string;
    cliente_nombre: string;
    metodo_pago: string;
    metodo_pago_display: string;
    subtotal: string;
    descuento: string;
    total: string;
    notas: string;
    items: {
      id: number;
      variante: number;
      variante_str: string;
      sku_variante: string;
      cantidad: number;
      precio_unitario: string;
      subtotal: string;
    }[];
  }>(`/ventas/${id}/`, NO_CACHE);
}

export async function getPedidoDetalle(id: number | string) {
  return fetchAPI<{
    id: number;
    numero_pedido: string;
    estado: string;
    metodo_pago: string | null;
    subtotal: string;
    descuento: string;
    total: string;
    notas: string;
    created_at: string;
    updated_at: string;
    usuario: { id: number; username: string; email: string };
    direccion: {
      calle: string;
      ciudad: string;
      cp: string;
      estado: string;
    } | null;
    items: {
      id: number;
      variante_str: string;
      cantidad: number;
      precio_unitario: string;
      subtotal: string;
    }[];
  }>(`/pedidos/${id}/`, NO_CACHE);
}

export const ADMIN_PAGE_SIZE = 20;

export async function listProductos(
  page = 1,
  search = "",
): Promise<Paginated<AdminProducto>> {
  const q = new URLSearchParams({
    page: String(page),
    page_size: String(ADMIN_PAGE_SIZE),
  });
  if (search) q.set("search", search);
  return fetchAPI<Paginated<AdminProducto>>(
    `/catalogo/productos/?${q.toString()}`,
    NO_CACHE,
  );
}

export async function listPedidos(
  page = 1,
  estado = "",
  opts: { search?: string; desde?: string; hasta?: string } = {},
): Promise<Paginated<AdminPedido>> {
  const q = new URLSearchParams({
    page: String(page),
    page_size: String(ADMIN_PAGE_SIZE),
  });
  if (estado) q.set("estado", estado);
  if (opts.search) q.set("search", opts.search);
  if (opts.desde) q.set("created_at__gte", opts.desde);
  if (opts.hasta) q.set("created_at__lte", opts.hasta);
  return fetchAPI<Paginated<AdminPedido>>(
    `/pedidos/?${q.toString()}`,
    NO_CACHE,
  );
}

export async function listVentas(): Promise<Paginated<AdminVenta>> {
  return fetchAPI<Paginated<AdminVenta>>("/ventas/", NO_CACHE);
}

export async function listSuscriptores(
  page = 1,
  search = "",
): Promise<Paginated<Suscriptor>> {
  const q = new URLSearchParams({
    page: String(page),
    page_size: String(ADMIN_PAGE_SIZE),
  });
  if (search) q.set("search", search);
  return fetchAPI<Paginated<Suscriptor>>(
    `/newsletter/suscriptores/?${q.toString()}`,
    NO_CACHE,
  );
}

export async function listUsuarios(
  page = 1,
  search = "",
): Promise<AdminUsuario[] | Paginated<AdminUsuario>> {
  const q = new URLSearchParams({
    page: String(page),
    page_size: String(ADMIN_PAGE_SIZE),
  });
  if (search) q.set("search", search);
  return fetchAPI<AdminUsuario[] | Paginated<AdminUsuario>>(
    `/auth/users/?${q.toString()}`,
    NO_CACHE,
  ).catch(
    () => [] as AdminUsuario[],
  );
}

export async function listCategorias(): Promise<Categoria[] | Paginated<Categoria>> {
  return fetchAPI<Categoria[] | Paginated<Categoria>>("/catalogo/categorias/", NO_CACHE);
}

export async function listMarcas(): Promise<Marca[] | Paginated<Marca>> {
  return fetchAPI<Marca[] | Paginated<Marca>>("/catalogo/marcas/", NO_CACHE);
}

export async function listProveedores(
  page = 1,
  search = "",
): Promise<Paginated<Proveedor>> {
  const q = new URLSearchParams({
    page: String(page),
    page_size: String(ADMIN_PAGE_SIZE),
  });
  if (search) q.set("search", search);
  return fetchAPI<Paginated<Proveedor>>(
    `/inventario/proveedores/?${q.toString()}`,
    NO_CACHE,
  );
}

export async function listOrdenesCompra(
  page = 1,
  estado = "",
): Promise<Paginated<OrdenCompra>> {
  const q = new URLSearchParams({
    page: String(page),
    page_size: String(ADMIN_PAGE_SIZE),
  });
  if (estado) q.set("estado", estado);
  return fetchAPI<Paginated<OrdenCompra>>(
    `/inventario/ordenes-compra/?${q.toString()}`,
    NO_CACHE,
  );
}
