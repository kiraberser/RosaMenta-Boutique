"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { fetchAPI, ApiError } from "@shared/lib/api";
import {
  type ActionState,
  errorState,
  okState,
  type FieldErrors,
} from "@shared/lib/action-types";

import { loginSchema, registerSchema } from "../schemas";
import type { AuthTokens, Usuario } from "../types";

const ACCESS_COOKIE = "access_cookie";
const REFRESH_COOKIE = "refresh_cookie";
const ACCESS_MAX_AGE = 60 * 60 * 12;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

function setAuthCookies(tokens: AuthTokens) {
  const store = cookies();
  const isProd = process.env.NODE_ENV === "production";
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
  };
  store.set(ACCESS_COOKIE, tokens.access, { ...base, maxAge: ACCESS_MAX_AGE });
  store.set(REFRESH_COOKIE, tokens.refresh, { ...base, maxAge: REFRESH_MAX_AGE });
}

function clearAuthCookies() {
  const store = cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

function flattenZodErrors(issues: { path: (string | number)[]; message: string }[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "_root");
    const existing = errors[key];
    if (Array.isArray(existing)) existing.push(issue.message);
    else errors[key] = [issue.message];
  }
  return errors;
}

function apiErrorToFieldErrors(err: ApiError): FieldErrors | undefined {
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

async function fetchMe(): Promise<Usuario | null> {
  try {
    return await fetchAPI<Usuario>("/auth/me/", { cache: "no-store" });
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<Usuario | null> {
  if (!cookies().get(ACCESS_COOKIE)?.value) return null;
  return fetchMe();
}

export async function loginAction(
  _prev: ActionState<Usuario>,
  formData: FormData,
): Promise<ActionState<Usuario>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return errorState("Revisa los campos", flattenZodErrors(parsed.error.issues));
  }

  try {
    const tokens = await fetchAPI<AuthTokens>("/auth/login/", {
      method: "POST",
      auth: false,
      body: { username: parsed.data.email, password: parsed.data.password },
    });
    setAuthCookies(tokens);
    const usuario = await fetchMe();
    revalidatePath("/", "layout");
    return okState("Sesión iniciada", usuario ?? undefined);
  } catch (e) {
    if (e instanceof ApiError) {
      return errorState("Credenciales inválidas", apiErrorToFieldErrors(e));
    }
    return errorState("No se pudo iniciar sesión");
  }
}

export async function registerAction(
  _prev: ActionState<Usuario>,
  formData: FormData,
): Promise<ActionState<Usuario>> {
  const parsed = registerSchema.safeParse({
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    email: formData.get("email"),
    telefono: formData.get("telefono") ?? "",
    password: formData.get("password"),
    password_confirm: formData.get("password_confirm"),
    suscribir_newsletter: formData.get("suscribir_newsletter") === "on",
  });
  if (!parsed.success) {
    return errorState("Revisa los campos", flattenZodErrors(parsed.error.issues));
  }

  const d = parsed.data;
  const username = d.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").slice(0, 30)
    || `user${Date.now()}`;

  try {
    await fetchAPI("/auth/register/", {
      method: "POST",
      auth: false,
      body: {
        username,
        email: d.email,
        first_name: d.nombre,
        last_name: d.apellido,
        phone: d.telefono ?? "",
        password: d.password,
        password_confirm: d.password_confirm,
        acepta_newsletter: d.suscribir_newsletter ?? false,
      },
    });
    const tokens = await fetchAPI<AuthTokens>("/auth/login/", {
      method: "POST",
      auth: false,
      body: { username, password: d.password },
    });
    setAuthCookies(tokens);
    const usuario = await fetchMe();
    revalidatePath("/", "layout");
    return okState("Cuenta creada", usuario ?? undefined);
  } catch (e) {
    if (e instanceof ApiError) {
      return errorState(e.message, apiErrorToFieldErrors(e));
    }
    return errorState("No se pudo crear la cuenta");
  }
}

export async function logoutAction(): Promise<void> {
  const refresh = cookies().get(REFRESH_COOKIE)?.value;
  if (refresh) {
    try {
      await fetchAPI("/auth/logout/", { method: "POST", body: { refresh } });
    } catch {
      /* igual limpiamos cookies */
    }
  }
  clearAuthCookies();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function refreshTokenAction(): Promise<boolean> {
  const refresh = cookies().get(REFRESH_COOKIE)?.value;
  if (!refresh) return false;
  try {
    const res = await fetchAPI<AuthTokens>("/auth/token/refresh/", {
      method: "POST",
      auth: false,
      body: { refresh },
    });
    setAuthCookies(res);
    return true;
  } catch {
    clearAuthCookies();
    return false;
  }
}
