"use client";

import { useFormStatus } from "react-dom";

import {
  confirmarOrdenAction,
  recibirOrdenAction,
} from "@features/admin/actions/proveedores";
import type { OrdenCompraEstado } from "@features/admin/types";

function Btn({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "success";
}) {
  const { pending } = useFormStatus();
  const cls =
    tone === "success"
      ? "border-[#00C853] text-[#00C853] hover:bg-[#00C853] hover:text-black"
      : "border-white text-white hover:bg-white hover:text-black";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] disabled:opacity-50 ${cls}`}
    >
      {pending ? "[...]" : label}
    </button>
  );
}

export function OrdenCompraActions({
  id,
  estado,
}: {
  id: number;
  estado: OrdenCompraEstado;
}) {
  if (estado === "BORRADOR") {
    return (
      <form action={confirmarOrdenAction}>
        <input type="hidden" name="id" value={id} />
        <Btn label="✓ CONFIRMAR" tone="primary" />
      </form>
    );
  }
  if (estado === "CONFIRMADO") {
    return (
      <form action={recibirOrdenAction}>
        <input type="hidden" name="id" value={id} />
        <Btn label="↓ RECIBIR" tone="success" />
      </form>
    );
  }
  return (
    <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-600">
      —
    </span>
  );
}
