import { fetchAPI } from "@shared/lib/api";

import type { Pedido } from "@features/checkout/types";

type Paginated<T> = { count: number; next: string | null; results: T[] };

export async function listMisPedidos(): Promise<Pedido[]> {
  try {
    const data = await fetchAPI<Paginated<Pedido>>("/pedidos/pedidos/", {
      cache: "no-store",
    });
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function cancelarPedido(id: number, motivo?: string) {
  return fetchAPI<Pedido>(`/pedidos/pedidos/${id}/cancelar/`, {
    method: "POST",
    body: { motivo: motivo ?? "" },
  });
}
