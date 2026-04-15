"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createCategoriaAction,
  createMarcaAction,
  deleteCategoriaAction,
  deleteMarcaAction,
} from "@features/admin/actions/catalogo";

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-white px-4 py-2 font-mono text-[11px] tracking-[0.25em] text-white hover:bg-white hover:text-black disabled:opacity-50"
    >
      {pending ? "[...]" : label}
    </button>
  );
}

function DeleteBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-mono text-[10px] tracking-[0.2em] text-[#D71921] hover:underline disabled:opacity-50"
    >
      {pending ? "..." : "× ELIMINAR"}
    </button>
  );
}

function Err({ state }: { state: { success: boolean; message: string } }) {
  if (!state.message) return null;
  return (
    <p
      className={`font-mono text-[10px] tracking-[0.2em] ${
        state.success ? "text-[#00C853]" : "text-[#D71921]"
      }`}
    >
      [{state.success ? "OK" : "ERR"}] {state.message}
    </p>
  );
}

type Categoria = { id: number; nombre: string; slug: string };
type Marca = { id: number; nombre: string };

export function CategoriasManager({ items }: { items: Categoria[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(createCategoriaAction, {
    success: false,
    message: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
          CATEGORÍAS · [{String(items.length).padStart(2, "0")}]
        </h2>
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-neutral-900 border border-neutral-900 bg-neutral-950">
          {items.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{c.nombre}</p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-neutral-600">
                  /{c.slug}
                </p>
              </div>
              <form action={deleteCategoriaAction}>
                <input type="hidden" name="id" value={c.id} />
                <DeleteBtn />
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-dashed border-neutral-800 px-6 py-8 text-center font-mono text-[10px] tracking-[0.25em] text-neutral-600">
          [SIN CATEGORÍAS]
        </p>
      )}

      <form
        ref={formRef}
        action={async (fd) => {
          await action(fd);
          formRef.current?.reset();
        }}
        className="grid grid-cols-1 gap-3 border border-neutral-900 bg-neutral-950 p-4 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          name="nombre"
          placeholder="Nombre"
          required
          className="border border-neutral-800 bg-black px-3 py-2 font-mono text-xs text-white"
        />
        <input
          name="slug"
          placeholder="slug-url"
          required
          className="border border-neutral-800 bg-black px-3 py-2 font-mono text-xs text-white"
        />
        <SubmitBtn label="+ CREAR" />
      </form>
      <Err state={state} />
    </div>
  );
}

export function MarcasManager({ items }: { items: Marca[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(createMarcaAction, {
    success: false,
    message: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
          MARCAS · [{String(items.length).padStart(2, "0")}]
        </h2>
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-neutral-900 border border-neutral-900 bg-neutral-950">
          {items.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <p className="text-sm text-white">{m.nombre}</p>
              <form action={deleteMarcaAction}>
                <input type="hidden" name="id" value={m.id} />
                <DeleteBtn />
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-dashed border-neutral-800 px-6 py-8 text-center font-mono text-[10px] tracking-[0.25em] text-neutral-600">
          [SIN MARCAS]
        </p>
      )}

      <form
        ref={formRef}
        action={async (fd) => {
          await action(fd);
          formRef.current?.reset();
        }}
        className="grid grid-cols-1 gap-3 border border-neutral-900 bg-neutral-950 p-4 sm:grid-cols-[1fr_auto]"
      >
        <input
          name="nombre"
          placeholder="Nombre"
          required
          className="border border-neutral-800 bg-black px-3 py-2 font-mono text-xs text-white"
        />
        <SubmitBtn label="+ CREAR" />
      </form>
      <Err state={state} />
    </div>
  );
}
