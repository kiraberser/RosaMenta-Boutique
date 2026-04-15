"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { fetchAPI, ApiError } from "@shared/lib/api";
import {
  type ActionState,
  errorState,
  okState,
  type FieldErrors,
} from "@shared/lib/action-types";

const productoBaseSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  sku: z.string().min(1, "SKU requerido"),
  descripcion: z.string().min(1, "Descripción requerida"),
  precio: z.coerce.number().positive("Precio inválido"),
  precio_descuento: z
    .union([z.coerce.number().positive(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  estado: z.enum(["NUE", "USA", "REA"]).default("NUE"),
  categoria_id: z.coerce.number().int().positive(),
  marca_id: z.coerce.number().int().positive(),
  destacado: z.boolean().default(false),
});

function flatten(issues: { path: (string | number)[]; message: string }[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "_root");
    (errors[k] ??= [] as string[]);
    (errors[k] as string[]).push(i.message);
  }
  return errors;
}

function apiErrorToFields(err: ApiError): FieldErrors | undefined {
  if (err.payload && typeof err.payload === "object") {
    const out: FieldErrors = {};
    for (const [k, v] of Object.entries(err.payload as Record<string, unknown>)) {
      if (Array.isArray(v)) out[k] = v.map(String);
      else if (typeof v === "string") out[k] = [v];
    }
    return Object.keys(out).length ? out : undefined;
  }
  return undefined;
}

export async function createProductoAction(
  _prev: ActionState<{ id: number }>,
  formData: FormData,
): Promise<ActionState<{ id: number }>> {
  const parsed = productoBaseSchema.safeParse({
    nombre: formData.get("nombre"),
    sku: formData.get("sku"),
    descripcion: formData.get("descripcion"),
    precio: formData.get("precio"),
    precio_descuento: formData.get("precio_descuento") ?? "",
    estado: formData.get("estado") ?? "NUE",
    categoria_id: formData.get("categoria_id"),
    marca_id: formData.get("marca_id"),
    destacado: formData.get("destacado") === "on",
  });

  if (!parsed.success) {
    return errorState("Revisa los campos", flatten(parsed.error.issues));
  }

  try {
    const created = await fetchAPI<{ id: number }>("/catalogo/productos/", {
      method: "POST",
      body: { ...parsed.data, activo: false },
    });
    revalidatePath("/admin/productos");
    return okState("Producto creado", { id: created.id });
  } catch (e) {
    if (e instanceof ApiError) {
      return errorState(e.message, apiErrorToFields(e));
    }
    return errorState("No se pudo crear el producto");
  }
}

export async function updateProductoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id");
  if (!id) return errorState("Falta ID");

  const parsed = productoBaseSchema.safeParse({
    nombre: formData.get("nombre"),
    sku: formData.get("sku"),
    descripcion: formData.get("descripcion"),
    precio: formData.get("precio"),
    precio_descuento: formData.get("precio_descuento") ?? "",
    estado: formData.get("estado") ?? "NUE",
    categoria_id: formData.get("categoria_id"),
    marca_id: formData.get("marca_id"),
    destacado: formData.get("destacado") === "on",
  });
  if (!parsed.success) {
    return errorState("Revisa los campos", flatten(parsed.error.issues));
  }

  try {
    await fetchAPI(`/catalogo/productos/${id}/`, {
      method: "PATCH",
      body: parsed.data,
    });
    revalidatePath(`/admin/productos/${id}`);
    revalidatePath("/admin/productos");
    return okState("Producto actualizado");
  } catch (e) {
    if (e instanceof ApiError) {
      return errorState(e.message, apiErrorToFields(e));
    }
    return errorState("No se pudo actualizar");
  }
}

export async function toggleActivoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id");
  const activo = formData.get("activo") === "true";
  if (!id) return errorState("Falta ID");

  try {
    await fetchAPI(`/catalogo/productos/${id}/`, {
      method: "PATCH",
      body: { activo: !activo },
    });
    revalidatePath(`/admin/productos/${id}`);
    return okState(activo ? "Producto desactivado" : "Producto activado");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo cambiar el estado");
  }
}

export async function uploadImagenAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const productoId = formData.get("producto_id");
  const imagen = formData.get("imagen");
  if (!productoId || !imagen) return errorState("Imagen requerida");

  const payload = new FormData();
  payload.append("producto", String(productoId));
  payload.append("imagen", imagen);
  payload.append("orden", String(formData.get("orden") ?? "0"));
  payload.append(
    "es_principal",
    formData.get("es_principal") === "on" ? "true" : "false",
  );

  try {
    await fetchAPI("/catalogo/imagenes/", {
      method: "POST",
      body: payload,
    });
    revalidatePath(`/admin/productos/${productoId}`);
    return okState("Imagen subida");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo subir la imagen");
  }
}

export async function setImagenPrincipalAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id");
  const productoId = formData.get("producto_id");
  if (!id) return errorState("Falta ID");

  try {
    await fetchAPI(`/catalogo/imagenes/${id}/`, {
      method: "PATCH",
      body: { es_principal: true },
    });
    if (productoId) revalidatePath(`/admin/productos/${productoId}`);
    return okState("Imagen marcada como principal");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo actualizar");
  }
}

export async function deleteImagenAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id");
  const productoId = formData.get("producto_id");
  if (!id) return errorState("Falta ID");

  try {
    await fetchAPI(`/catalogo/imagenes/${id}/`, { method: "DELETE" });
    if (productoId) revalidatePath(`/admin/productos/${productoId}`);
    return okState("Imagen eliminada");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo eliminar");
  }
}

const varianteSchema = z.object({
  producto: z.coerce.number().int().positive(),
  talla: z.string().min(1, "Talla requerida"),
  color: z.string().min(1, "Color requerido"),
  sku_variante: z.string().min(1, "SKU requerido"),
  precio_extra: z.coerce.number().min(0).default(0),
});

export async function createVarianteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = varianteSchema.safeParse({
    producto: formData.get("producto"),
    talla: formData.get("talla"),
    color: formData.get("color"),
    sku_variante: formData.get("sku_variante"),
    precio_extra: formData.get("precio_extra") ?? 0,
  });
  if (!parsed.success) {
    return errorState("Revisa los campos", flatten(parsed.error.issues));
  }

  try {
    await fetchAPI("/catalogo/variantes/", {
      method: "POST",
      body: parsed.data,
    });
    revalidatePath(`/admin/productos/${parsed.data.producto}`);
    return okState("Variante creada");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message, apiErrorToFields(e));
    return errorState("No se pudo crear la variante");
  }
}

export async function deleteVarianteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id");
  const productoId = formData.get("producto_id");
  if (!id) return errorState("Falta ID");

  try {
    await fetchAPI(`/catalogo/variantes/${id}/`, { method: "DELETE" });
    if (productoId) revalidatePath(`/admin/productos/${productoId}`);
    return okState("Variante eliminada");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo eliminar");
  }
}

export async function cambiarEstadoPedidoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id");
  const estado = formData.get("estado");
  if (!id || !estado) return errorState("Datos incompletos");

  try {
    await fetchAPI(`/pedidos/${id}/cambiar-estado/`, {
      method: "POST",
      body: { estado },
    });
    revalidatePath(`/admin/pedidos/${id}`);
    revalidatePath("/admin/pedidos");
    return okState("Estado actualizado");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo actualizar");
  }
}
