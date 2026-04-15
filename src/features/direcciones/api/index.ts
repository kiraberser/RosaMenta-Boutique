import { fetchAPI } from "@shared/lib/api";

import type { Direccion } from "@features/auth/types";

type Paginated<T> = { results: T[]; count: number };

export async function listDirecciones(): Promise<Direccion[]> {
  try {
    const data = await fetchAPI<Paginated<Direccion> | Direccion[]>(
      "/auth/direcciones/",
      { cache: "no-store" },
    );
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

export type DireccionPayload = {
  calle: string;
  ciudad: string;
  cp: string;
  estado: string;
  pais?: string;
  es_principal?: boolean;
};

export async function createDireccion(payload: DireccionPayload): Promise<Direccion> {
  return fetchAPI<Direccion>("/auth/direcciones/", {
    method: "POST",
    body: { pais: "México", ...payload },
  });
}

export async function deleteDireccion(id: number): Promise<void> {
  await fetchAPI(`/auth/direcciones/${id}/`, { method: "DELETE" });
}
