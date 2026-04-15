"use server";

import {
  type ActionState,
  errorState,
  okState,
  type FieldErrors,
} from "@shared/lib/action-types";
import { ApiError, fetchAPI } from "@shared/lib/api";

import { suscribirSchema } from "../schemas";

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

export async function suscribirNewsletterAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = suscribirSchema.safeParse({
    email: formData.get("email"),
    nombre: formData.get("nombre") ?? "",
  });
  if (!parsed.success) {
    return errorState("Revisa tu correo", flattenZod(parsed.error.issues));
  }

  const origen = String(formData.get("origen") ?? "FOR");

  try {
    const res = await fetchAPI<{ detail: string }>("/newsletter/suscribir/", {
      method: "POST",
      auth: false,
      body: { ...parsed.data, origen },
    });
    return okState(res.detail ?? "¡Gracias por suscribirte!");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo suscribir");
  }
}

export async function bajaNewsletterAction(token: string): Promise<ActionState> {
  if (!token) return errorState("Token inválido");
  try {
    const res = await fetchAPI<{ detail: string }>(
      `/newsletter/baja/?token=${encodeURIComponent(token)}`,
      { auth: false, cache: "no-store" },
    );
    return okState(res.detail ?? "Suscripción cancelada");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo cancelar la suscripción");
  }
}
