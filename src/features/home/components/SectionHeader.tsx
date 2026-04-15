"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  cta?: { href: string; label: string };
};

export function SectionHeader({ eyebrow, title, subtitle, cta }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div>
        <p className="text-[10px] tracking-[0.3em] text-rosa-500">{eyebrow}</p>
        <h2 className="mt-2 font-display text-4xl text-neutral-900 sm:text-5xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 max-w-xl text-sm text-neutral-600">{subtitle}</p>
        ) : null}
      </div>
      {cta ? (
        <Link
          href={cta.href}
          className="group inline-flex items-center gap-1 text-sm text-rosa-500 hover:text-rosa-600"
        >
          {cta.label}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      ) : null}
    </motion.div>
  );
}
