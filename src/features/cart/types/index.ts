export type CartLine = {
  varianteId: number;
  productoId: number;
  nombre: string;
  sku: string;
  talla: string;
  color: string;
  imagen: string | null;
  precio: number;
  cantidad: number;
};

export type ServerCartItem = {
  id: number;
  variante: number;
  variante_str: string;
  cantidad: number;
  precio_snapshot: string;
  subtotal: string;
  agregado_en: string;
};

export type ServerCart = {
  id: number;
  items: ServerCartItem[];
  subtotal: string;
  creado_en: string;
};
