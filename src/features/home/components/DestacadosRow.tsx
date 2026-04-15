"use client";

import { motion } from "framer-motion";

import { ProductCard } from "@features/catalog/components/ProductCard";
import type { ProductoListItem } from "@features/catalog/types";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function DestacadosRow({ productos }: { productos: ProductoListItem[] }) {
  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
        Pronto tendremos destacados para ti.
      </div>
    );
  }

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {productos.map((p) => (
        <motion.li key={p.id} variants={item}>
          <ProductCard producto={p} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
