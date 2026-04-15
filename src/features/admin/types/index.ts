export type AdminDashboard = {
  fecha: string;
  ventas_hoy: { total: number | string; transacciones: number };
  ventas_mes: { total: number | string };
  pedidos_pendientes: number;
  stock_bajo: number;
  suscriptores_activos: number;
  top5_mes: { producto: string; cantidad: number }[];
};

export type Periodo = "hoy" | "semana" | "mes";

export type VentasResumen = {
  periodo: Periodo;
  desde: string;
  hasta: string;
  pedidos_online: {
    totales: { n: number; subtotal: string; total: string };
    serie: { bucket: string; transacciones: number; total: string }[];
  };
  ventas_directas: {
    totales: { n: number; subtotal: string; total: string };
    serie: { bucket: string; transacciones: number; total: string }[];
  };
  gran_total: number | string;
};

export type TopProducto = {
  producto_id: number;
  producto: string;
  sku: string;
  cantidad: number;
  ingresos: number;
};

export type StockBajoItem = {
  stock_id: number;
  producto: string;
  sku: string;
  variante: string;
  sku_variante: string;
  cantidad: number;
  stock_minimo: number;
  faltante: number;
};

export type Movimiento = {
  id: number;
  fecha: string;
  tipo: string;
  tipo_display: string;
  cantidad: number;
  producto: string;
  variante: string;
  usuario: string | null;
  motivo: string;
  referencia: string;
};

export type NewsletterMetrics = {
  activos: number;
  inactivos: number;
  altas_mes: number;
  bajas_mes: number;
  por_origen: { origen: string; total: number }[];
};

export type Suscriptor = {
  id: number;
  email: string;
  activo: boolean;
  origen: string;
  fecha_suscripcion: string;
  fecha_baja: string | null;
};

export type AdminProducto = {
  id: number;
  nombre: string;
  sku: string;
  precio: string;
  precio_descuento: string | null;
  precio_final: string;
  estado: string;
  categoria: string | { id: number; nombre: string };
  marca: string | { id: number; nombre: string };
  activo: boolean;
  destacado: boolean;
  imagen_principal: string | null;
  created_at: string;
};

export type AdminPedido = {
  id: number;
  numero_pedido: string;
  estado: string;
  metodo_pago: string | null;
  subtotal: string;
  descuento: string;
  total: string;
  created_at: string;
  usuario: number | { id: number; username: string; email: string };
};

export type AdminVenta = {
  id: number;
  numero_ticket: string;
  cliente_nombre: string;
  metodo_pago: string;
  subtotal: string;
  descuento: string;
  total: string;
  fecha: string;
  vendedor: number | string;
};

export type AdminUsuario = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  acepta_newsletter: boolean;
  date_joined: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Categoria = { id: number; nombre: string; slug: string };
export type Marca = { id: number; nombre: string };

export type Proveedor = {
  id: number;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  productos: number[];
  activo: boolean;
  created_at: string;
};

export type OrdenCompraEstado = "BORRADOR" | "CONFIRMADO" | "RECIBIDO" | "CANCELADO";

export type OrdenCompraItem = {
  id: number;
  variante: number;
  cantidad: number;
  costo_unitario: string;
  subtotal: string;
};

export type OrdenCompra = {
  id: number;
  proveedor: number;
  proveedor_nombre: string;
  estado: OrdenCompraEstado;
  notas: string;
  items: OrdenCompraItem[];
  total: string;
  creada_por: number | null;
  fecha_creacion: string;
  fecha_confirmacion: string | null;
  fecha_recepcion: string | null;
};
