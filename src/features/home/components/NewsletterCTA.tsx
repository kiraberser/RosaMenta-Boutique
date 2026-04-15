"use client";

import { motion } from "framer-motion";

import { NewsletterForm } from "@features/newsletter/components/NewsletterForm";

export function NewsletterCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rosa-500 via-rosa-400 to-menta-400 p-10 text-white sm:p-14"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/20 blur-2xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="text-[10px] tracking-[0.35em] text-white/80">NEWSLETTER</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">
          Sé la primera en saberlo
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/90">
          Recibe nuevas colecciones, promos y ofertas exclusivas directo a tu correo.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <NewsletterForm origen="HOM" variant="inline" />
        </div>
      </div>
    </motion.section>
  );
}
