"use server";

import { revalidatePath } from "next/cache";

import {
  type ActionState,
  errorState,
  okState,
} from "@shared/lib/action-types";
import { ApiError } from "@shared/lib/api";

import { cancelarPedido } from "../api/pedidos";

export async function cancelarPedidoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("pedido_id"));
  const motivo = String(formData.get("motivo") ?? "");
  if (!id) return errorState("Pedido inválido");
  try {
    await cancelarPedido(id, motivo);
    revalidatePath("/cuenta/pedidos");
    revalidatePath(`/cuenta/pedidos/${id}`);
    return okState("Pedido cancelado");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo cancelar");
  }
}
