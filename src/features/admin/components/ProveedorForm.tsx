"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createProveedorAction,
  toggleProveedorAction,
} from "@features/admin/actions/proveedores";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-white px-5 py-2 font-mono text-[11px] tracking-[0.25em] text-white hover:bg-white hover:text-black disabled:opacity-50"
    >
      {pending ? "[...]" : "+ CREAR"}
    </button>
  );
}

function ToggleBtn({ activo }: { activo: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`font-mono text-[10px] tracking-[0.25em] ${
        activo ? "text-[#D71921]" : "text-[#00C853]"
      } hover:underline disabled:opacity-50`}
    >
      {pending ? "..." : activo ? "○ DESACTIVAR" : "● ACTIVAR"}
    </button>
  );
}

export function NewProveedorForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(createProveedorAction, {
    success: false,
    message: "",
  });

  const getErr = (k: string) => {
    const v = state.errors?.[k];
    return Array.isArray(v) ? v[0] : v;
  };

  return (
    <div className="space-y-3">
      <form
        ref={ref}
        action={async (fd) => {
          await action(fd);
          if (ref.current) ref.current.reset();
        }}
        className="grid grid-cols-1 gap-3 border border-neutral-900 bg-neutral-950 p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
      >
        <div>
          <input
            name="nombre"
            placeholder="Nombre *"
            required
            className="w-full border border-neutral-800 bg-black px-3 py-2 font-mono text-xs text-white"
          />
          {getErr("nombre") ? (
            <p className="mt-1 font-mono text-[10px] text-[#D71921]">
              {getErr("nombre")}
            </p>
          ) : null}
        </div>
        <input
          name="contacto"
          placeholder="Contacto"
          className="border border-neutral-800 bg-black px-3 py-2 font-mono text-xs text-white"
        />
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border border-neutral-800 bg-black px-3 py-2 font-mono text-xs text-white"
          />
          {getErr("email") ? (
            <p className="mt-1 font-mono text-[10px] text-[#D71921]">
              {getErr("email")}
            </p>
          ) : null}
        </div>
        <input
          name="telefono"
          placeholder="Teléfono"
          className="border border-neutral-800 bg-black px-3 py-2 font-mono text-xs text-white"
        />
        <input type="hidden" name="activo" value="true" />
        <SubmitBtn />
      </form>

      {state.message ? (
        <p
          className={`font-mono text-[10px] tracking-[0.2em] ${
            state.success ? "text-[#00C853]" : "text-[#D71921]"
          }`}
        >
          [{state.success ? "OK" : "ERR"}] {state.message}
        </p>
      ) : null}
    </div>
  );
}

export function ProveedorToggleForm({
  id,
  activo,
}: {
  id: number;
  activo: boolean;
}) {
  return (
    <form action={toggleProveedorAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="activo" value={String(activo)} />
      <ToggleBtn activo={activo} />
    </form>
  );
}
