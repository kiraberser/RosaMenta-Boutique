"use client";

import Image from "next/image";
import * as React from "react";
import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteImagenAction,
  setImagenPrincipalAction,
  uploadImagenAction,
} from "@features/admin/actions/productos";

type Imagen = {
  id: number;
  imagen_url: string;
  orden: number;
  es_principal: boolean;
};

function UploadBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-white px-5 py-2 font-mono text-[11px] tracking-[0.25em] text-white hover:bg-white hover:text-black disabled:opacity-50"
    >
      {pending ? "[SUBIENDO...]" : "↑ SUBIR"}
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

export function ImagenUploader({
  productoId,
  imagenes,
}: {
  productoId: number;
  imagenes: Imagen[];
}) {
  const uploadRef = useRef<HTMLFormElement>(null);
  const [uploadState, uploadAction] = (React.useActionState ?? useFormState)(
    uploadImagenAction,
    {
      success: false,
      message: "",
    },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
          IMÁGENES · [{String(imagenes.length).padStart(2, "0")}/04]
        </h2>
        <span className="font-mono text-[10px] text-neutral-600">
          MÍN. 4 PARA ACTIVAR
        </span>
      </div>

      {imagenes.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {imagenes.map((img) => (
            <li
              key={img.id}
              className="group relative aspect-square border border-neutral-900"
            >
              <Image
                src={img.imagen_url}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 640px) 25vw, 50vw"
              />
              {img.es_principal ? (
                <span className="absolute left-2 top-2 bg-black px-2 py-1 font-mono text-[9px] tracking-[0.25em] text-white">
                  PRINCIPAL
                </span>
              ) : (
                <form
                  action={setImagenPrincipalAction}
                  className="absolute left-2 top-2 opacity-0 transition group-hover:opacity-100"
                >
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="producto_id" value={productoId} />
                  <button
                    type="submit"
                    className="bg-black/80 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-neutral-300 hover:text-white"
                  >
                    ○ HACER PRINCIPAL
                  </button>
                </form>
              )}
              <form
                action={deleteImagenAction}
                className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/80 px-2 py-1 opacity-0 transition group-hover:opacity-100"
              >
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="producto_id" value={productoId} />
                <span className="font-mono text-[9px] text-neutral-500">
                  #{img.orden}
                </span>
                <DeleteBtn />
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-dashed border-neutral-800 px-6 py-12 text-center font-mono text-[10px] tracking-[0.25em] text-neutral-600">
          [SIN IMÁGENES]
        </p>
      )}

      <form
        ref={uploadRef}
        action={async (fd) => {
          await uploadAction(fd);
          uploadRef.current?.reset();
        }}
        className="flex flex-col gap-3 border border-neutral-900 bg-neutral-950 p-4 sm:flex-row sm:items-center"
      >
        <input type="hidden" name="producto_id" value={productoId} />
        <input
          type="file"
          name="imagen"
          accept="image/*"
          required
          className="flex-1 font-mono text-xs text-neutral-300 file:mr-3 file:border file:border-neutral-700 file:bg-black file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:tracking-[0.2em] file:text-neutral-300"
        />
        <input
          type="number"
          name="orden"
          defaultValue={imagenes.length}
          min="0"
          className="w-20 border border-neutral-800 bg-black px-2 py-1.5 text-center font-mono text-xs text-white"
          aria-label="Orden"
        />
        <label className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-neutral-500">
          <input type="checkbox" name="es_principal" className="accent-white" />
          PRINCIPAL
        </label>
        <UploadBtn />
      </form>

      {uploadState.message ? (
        <p
          className={`font-mono text-[10px] tracking-[0.2em] ${
            uploadState.success ? "text-[#00C853]" : "text-[#D71921]"
          }`}
        >
          [{uploadState.success ? "OK" : "ERR"}] {uploadState.message}
        </p>
      ) : null}
    </div>
  );
}
