export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  padre: number | null;
  hijas?: Categoria[];
};

export type Marca = {
  id: number;
  nombre: string;
  logo_url?: string | null;
};

export type EstadoProducto = "NUE" | "USA" | "REA";

export type ProductoImagen = {
  id: number;
  imagen_url: string;
  orden: number;
  es_principal: boolean;
};

export type ProductoVariante = {
  id: number;
  talla: string;
  color: string;
  sku_variante: string;
  precio_extra: string;
  precio_final: string;
};

export type ProductoListItem = {
  id: number;
  nombre: string;
  sku: string;
  precio: string;
  precio_descuento: string | null;
  precio_final: string;
  estado: EstadoProducto;
  categoria: string;
  marca: string;
  activo: boolean;
  destacado: boolean;
  imagen_principal: string | null;
  created_at: string;
};

export type ProductoDetalle = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_descuento: string | null;
  precio_final: string;
  sku: string;
  estado: EstadoProducto;
  categoria: Categoria;
  marca: Marca;
  activo: boolean;
  destacado: boolean;
  imagenes: ProductoImagen[];
  variantes: ProductoVariante[];
  created_at: string;
  updated_at: string;
};

export type CatalogoFilters = {
  categoria?: string;
  marca?: string;
  estado?: EstadoProducto;
  destacado?: boolean;
  search?: string;
  ordering?: "precio" | "-precio" | "-created_at" | "created_at";
  page?: number;
};
