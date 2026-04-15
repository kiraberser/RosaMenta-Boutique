"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  type ActionState,
  errorState,
  okState,
} from "@shared/lib/action-types";
import { ApiError } from "@shared/lib/api";

import { crearPedido } from "../api";
import type { MetodoPago, Pedido } from "../types";

const METODOS = new Set<MetodoPago>(["EFE", "TRA", "MP"]);

export async function crearPedidoAction(
  _prev: ActionState<Pedido>,
  formData: FormData,
): Promise<ActionState<Pedido>> {
  const direccionId = Number(formData.get("direccion_id"));
  if (!direccionId) {
    return errorState("Selecciona una dirección", {
      direccion_id: ["Requerido"],
    });
  }
  const metodoRaw = String(formData.get("metodo_pago") ?? "");
  const metodo_pago = (METODOS.has(metodoRaw as MetodoPago)
    ? (metodoRaw as MetodoPago)
    : "") as MetodoPago | "";
  const notas = String(formData.get("notas") ?? "").slice(0, 500);

  let pedido: Pedido;
  try {
    pedido = await crearPedido({ direccion_id: direccionId, metodo_pago, notas });
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo crear el pedido");
  }

  revalidateTag("carrito");
  redirect(`/checkout/confirmacion/${pedido.id}`);
  return okState("Pedido creado", pedido);
}
