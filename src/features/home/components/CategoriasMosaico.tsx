"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import type { Categoria } from "@features/catalog/types";

const GRADIENTS = [
  "from-rosa-200 via-rosa-100 to-white",
  "from-menta-50 via-white to-rosa-50",
  "from-neutral-100 via-white to-menta-50",
  "from-rosa-50 via-white to-neutral-100",
  "from-menta-50 via-rosa-50 to-white",
  "from-rosa-100 via-white to-menta-50",
];

export function CategoriasMosaico({ categorias }: { categorias: Categoria[] }) {
  const top = categorias.filter((c) => c.padre == null).slice(0, 6);
  if (top.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
        Aun no hay categorias publicadas.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {top.map((c, i) => (
        <motion.li
          key={c.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.55,
            delay: i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            href={`/catalogo?categoria=${c.id}`}
            className="group block overflow-hidden rounded-2xl"
          >
            <div
              className={`relative aspect-square w-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} p-4`}
            >
              <div className="absolute inset-0 flex items-end justify-between p-4">
                <span className="font-display text-xl text-neutral-900 sm:text-2xl">
                  {c.nombre}
                </span>
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-sm text-rosa-500 backdrop-blur transition group-hover:translate-x-1 group-hover:bg-rosa-500 group-hover:text-white"
                >
                  →
                </span>
              </div>
            </div>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
