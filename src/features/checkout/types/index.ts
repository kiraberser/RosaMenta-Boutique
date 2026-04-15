export type MetodoPago = "EFE" | "TRA" | "MP";

export type PedidoItem = {
  id: number;
  variante: number;
  variante_str: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
};

export type Pedido = {
  id: number;
  numero_pedido: string;
  usuario: number;
  direccion: number;
  estado: string;
  estado_display: string;
  metodo_pago: MetodoPago | "";
  metodo_pago_display: string;
  subtotal: string;
  descuento: string;
  total: string;
  notas: string;
  items: PedidoItem[];
  created_at: string;
  updated_at: string;
};
