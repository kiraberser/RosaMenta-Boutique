import { fetchAPI } from "@shared/lib/api";

import type { ServerCart, ServerCartItem } from "../types";

export async function fetchCarrito(): Promise<ServerCart> {
  return fetchAPI<ServerCart>("/pedidos/carrito/", { cache: "no-store" });
}

export async function agregarItemCarrito(
  variante_id: number,
  cantidad: number,
): Promise<ServerCartItem> {
  return fetchAPI<ServerCartItem>("/pedidos/carrito/agregar/", {
    method: "POST",
    body: { variante_id, cantidad },
  });
}

export async function removerItemCarrito(itemId: number): Promise<void> {
  await fetchAPI(`/pedidos/carrito/items/${itemId}/`, {
    method: "DELETE",
  });
}

export async function vaciarCarrito(): Promise<ServerCart> {
  return fetchAPI<ServerCart>("/pedidos/carrito/vaciar/", { method: "POST" });
}
