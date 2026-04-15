"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@shared/lib/cn";

import type { ProductoImagen } from "../types";

export function ProductGallery({
  imagenes,
  alt,
}: {
  imagenes: ProductoImagen[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  if (imagenes.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl bg-neutral-100 text-sm text-neutral-400">
        Sin imágenes
      </div>
    );
  }
  const current = imagenes[active];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={current.imagen_url}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="object-cover"
        />
      </div>
      {imagenes.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {imagenes.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition",
                i === active ? "border-rosa-500" : "border-transparent hover:border-neutral-300",
              )}
            >
              <Image
                src={img.imagen_url}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
