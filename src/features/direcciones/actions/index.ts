"use server";

import { revalidatePath } from "next/cache";

import {
  type ActionState,
  errorState,
  okState,
  type FieldErrors,
} from "@shared/lib/action-types";
import { ApiError } from "@shared/lib/api";

import type { Direccion } from "@features/auth/types";

import { createDireccion, deleteDireccion } from "../api";
import { direccionSchema } from "../schemas";

function flattenZod(issues: { path: (string | number)[]; message: string }[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "_root");
    const existing = errors[key];
    if (Array.isArray(existing)) existing.push(issue.message);
    else errors[key] = [issue.message];
  }
  return errors;
}

export async function crearDireccionAction(
  _prev: ActionState<Direccion>,
  formData: FormData,
): Promise<ActionState<Direccion>> {
  const parsed = direccionSchema.safeParse({
    calle: formData.get("calle"),
    ciudad: formData.get("ciudad"),
    cp: formData.get("cp"),
    estado: formData.get("estado"),
    pais: formData.get("pais") || "México",
    es_principal: formData.get("es_principal") === "on",
  });
  if (!parsed.success) {
    return errorState("Revisa los campos", flattenZod(parsed.error.issues));
  }
  try {
    const direccion = await createDireccion(parsed.data);
    revalidatePath("/checkout");
    revalidatePath("/cuenta/direcciones");
    return okState("Dirección guardada", direccion);
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo guardar la dirección");
  }
}

export async function eliminarDireccionAction(id: number): Promise<ActionState> {
  try {
    await deleteDireccion(id);
    revalidatePath("/checkout");
    revalidatePath("/cuenta/direcciones");
    return okState("Dirección eliminada");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo eliminar");
  }
}
