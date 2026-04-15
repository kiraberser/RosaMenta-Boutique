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

const categoriaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(1, "Slug requerido"),
  descripcion: z.string().optional().default(""),
  padre_id: z
    .union([z.coerce.number().int().positive(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
});

const marcaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  descripcion: z.string().optional().default(""),
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

export async function createCategoriaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = categoriaSchema.safeParse({
    nombre: formData.get("nombre"),
    slug: formData.get("slug"),
    descripcion: formData.get("descripcion") ?? "",
    padre_id: formData.get("padre_id") ?? "",
  });
  if (!parsed.success) {
    return errorState("Datos inválidos", flatten(parsed.error.issues));
  }
  try {
    await fetchAPI("/catalogo/categorias/", {
      method: "POST",
      body: JSON.stringify(parsed.data),
      headers: { "Content-Type": "application/json" },
    });
    revalidatePath("/admin/catalogo");
    return okState("Categoría creada");
  } catch (err) {
    if (err instanceof ApiError) {
      return errorState(err.message, apiErrorToFields(err));
    }
    return errorState("Error inesperado");
  }
}

export async function deleteCategoriaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!id) return errorState("ID requerido");
  try {
    await fetchAPI(`/catalogo/categorias/${id}/`, { method: "DELETE" });
    revalidatePath("/admin/catalogo");
    return okState("Categoría eliminada");
  } catch (err) {
    if (err instanceof ApiError) return errorState(err.message);
    return errorState("Error inesperado");
  }
}

export async function createMarcaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = marcaSchema.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion") ?? "",
  });
  if (!parsed.success) {
    return errorState("Datos inválidos", flatten(parsed.error.issues));
  }
  try {
    await fetchAPI("/catalogo/marcas/", {
      method: "POST",
      body: JSON.stringify(parsed.data),
      headers: { "Content-Type": "application/json" },
    });
    revalidatePath("/admin/catalogo");
    return okState("Marca creada");
  } catch (err) {
    if (err instanceof ApiError) {
      return errorState(err.message, apiErrorToFields(err));
    }
    return errorState("Error inesperado");
  }
}

export async function deleteMarcaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!id) return errorState("ID requerido");
  try {
    await fetchAPI(`/catalogo/marcas/${id}/`, { method: "DELETE" });
    revalidatePath("/admin/catalogo");
    return okState("Marca eliminada");
  } catch (err) {
    if (err instanceof ApiError) return errorState(err.message);
    return errorState("Error inesperado");
  }
}
