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

const proveedorSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  contacto: z.string().optional().default(""),
  email: z
    .union([z.string().email("Email inválido"), z.literal("")])
    .optional()
    .transform((v) => v ?? ""),
  telefono: z.string().optional().default(""),
  activo: z.boolean().default(true),
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

export async function createProveedorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = proveedorSchema.safeParse({
    nombre: formData.get("nombre"),
    contacto: formData.get("contacto") ?? "",
    email: formData.get("email") ?? "",
    telefono: formData.get("telefono") ?? "",
    activo: formData.get("activo") === "on" || formData.get("activo") === "true",
  });
  if (!parsed.success) {
    return errorState("Datos inválidos", flatten(parsed.error.issues));
  }
  try {
    await fetchAPI("/inventario/proveedores/", {
      method: "POST",
      body: JSON.stringify({ ...parsed.data, productos: [] }),
      headers: { "Content-Type": "application/json" },
    });
    revalidatePath("/admin/proveedores");
    return okState("Proveedor creado");
  } catch (err) {
    if (err instanceof ApiError) {
      return errorState(err.message, apiErrorToFields(err));
    }
    return errorState("Error inesperado");
  }
}

export async function toggleProveedorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  const activo = formData.get("activo") === "true";
  if (!id) return errorState("ID requerido");
  try {
    await fetchAPI(`/inventario/proveedores/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ activo: !activo }),
      headers: { "Content-Type": "application/json" },
    });
    revalidatePath("/admin/proveedores");
    return okState(activo ? "Desactivado" : "Activado");
  } catch (err) {
    if (err instanceof ApiError) return errorState(err.message);
    return errorState("Error inesperado");
  }
}

export async function confirmarOrdenAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!id) return errorState("ID requerido");
  try {
    await fetchAPI(`/inventario/ordenes-compra/${id}/confirmar/`, {
      method: "POST",
    });
    revalidatePath("/admin/proveedores");
    return okState("Orden confirmada");
  } catch (err) {
    if (err instanceof ApiError) return errorState(err.message);
    return errorState("Error inesperado");
  }
}

export async function recibirOrdenAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!id) return errorState("ID requerido");
  try {
    await fetchAPI(`/inventario/ordenes-compra/${id}/recibir/`, {
      method: "POST",
    });
    revalidatePath("/admin/proveedores");
    return okState("Orden recibida y stock actualizado");
  } catch (err) {
    if (err instanceof ApiError) return errorState(err.message);
    return errorState("Error inesperado");
  }
}
