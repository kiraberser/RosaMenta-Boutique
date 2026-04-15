"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

import {
  type ActionState,
  errorState,
  okState,
} from "@shared/lib/action-types";
import { ApiError } from "@shared/lib/api";

import {
  agregarItemCarrito,
  removerItemCarrito,
  vaciarCarrito,
} from "../api";

function isAuth(): boolean {
  return Boolean(cookies().get("access_cookie")?.value);
}

export async function syncAddToServerAction(
  varianteId: number,
  cantidad: number,
): Promise<ActionState> {
  if (!isAuth()) return okState("local");
  try {
    await agregarItemCarrito(varianteId, cantidad);
    revalidateTag("carrito");
    return okState("Añadido al carrito");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo sincronizar el carrito");
  }
}

export async function syncRemoveFromServerAction(
  itemId: number,
): Promise<ActionState> {
  if (!isAuth()) return okState("local");
  try {
    await removerItemCarrito(itemId);
    revalidateTag("carrito");
    return okState("Producto eliminado");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo eliminar");
  }
}

export async function clearServerCartAction(): Promise<ActionState> {
  if (!isAuth()) return okState("local");
  try {
    await vaciarCarrito();
    revalidateTag("carrito");
    return okState("Carrito vaciado");
  } catch (e) {
    if (e instanceof ApiError) return errorState(e.message);
    return errorState("No se pudo vaciar el carrito");
  }
}
