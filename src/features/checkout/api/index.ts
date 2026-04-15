import { fetchAPI } from "@shared/lib/api";

import type { Pedido, MetodoPago } from "../types";

export type CrearPedidoPayload = {
  direccion_id: number;
  metodo_pago?: MetodoPago | "";
  notas?: string;
};

export async function crearPedido(payload: CrearPedidoPayload): Promise<Pedido> {
  return fetchAPI<Pedido>("/pedidos/pedidos/crear/", {
    method: "POST",
    body: payload,
  });
}

export async function getPedido(id: number | string): Promise<Pedido> {
  return fetchAPI<Pedido>(`/pedidos/pedidos/${id}/`, { cache: "no-store" });
}
