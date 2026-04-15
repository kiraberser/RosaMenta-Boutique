"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Blobs decorativos con parallax suave */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-32 h-[380px] w-[380px] rounded-full bg-rosa-100 blur-3xl sm:h-[520px] sm:w-[520px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={reduce ? { opacity: 0.7 } : { opacity: 0.8, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full bg-menta-50 blur-3xl sm:h-[560px] sm:w-[560px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={reduce ? { opacity: 0.8 } : { opacity: 0.9, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-rosa-200 bg-white/60 px-4 py-1.5 text-[10px] tracking-[0.25em] text-rosa-500 backdrop-blur"
          >
            <Sparkles className="h-3 w-3" /> NUEVA TEMPORADA
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-5xl leading-[1.05] text-neutral-900 sm:text-6xl lg:text-7xl"
          >
            Prendas que{" "}
            <span className="relative inline-block">
              <span className="text-rosa-500">enamoran</span>
              <motion.span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-menta-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <br />
            <span className="text-neutral-700">a primera vista.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-base text-neutral-600 sm:text-lg lg:mx-0"
          >
            Boutique curada en México. Ropa y accesorios con esa mezcla perfecta de{" "}
            <span className="text-rosa-500">rosa</span> y{" "}
            <span className="text-menta-400">menta</span> que define tu estilo.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              href="/catalogo"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-rosa-500 px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-rosa-500/20 transition hover:bg-rosa-600 hover:shadow-rosa-500/30 sm:w-auto"
            >
              Explorar catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/catalogo?destacado=true"
              className="w-full rounded-full border border-neutral-300 bg-white/80 px-8 py-3.5 text-center text-sm text-neutral-800 backdrop-blur transition hover:border-rosa-500 hover:text-rosa-500 sm:w-auto"
            >
              Ver destacados
            </Link>
          </motion.div>

          <motion.dl
            variants={item}
            className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-6 text-center lg:mx-0"
          >
            {[
              { k: "+500", v: "piezas curadas" },
              { k: "24h", v: "envío CDMX" },
              { k: "MX", v: "100% nacional" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl text-rosa-500 sm:text-3xl">{s.k}</dt>
                <dd className="mt-1 text-[10px] tracking-[0.15em] text-neutral-500">
                  {s.v.toUpperCase()}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-rosa-100 via-white to-menta-50 shadow-2xl">
            {!reduce ? (
              <>
                <motion.div
                  aria-hidden
                  className="absolute -left-8 top-12 h-36 w-36 rounded-[2rem] bg-rosa-500/80 sm:h-48 sm:w-48"
                  animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden
                  className="absolute bottom-16 right-6 h-28 w-28 rounded-full bg-menta-400/80 sm:h-40 sm:w-40"
                  animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
                <motion.div
                  aria-hidden
                  className="absolute right-16 top-8 h-14 w-14 rounded-2xl bg-white/80 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                />
              </>
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
              <div>
                <p className="text-xs tracking-[0.3em] text-neutral-500">EDITORIAL SS</p>
                <p className="mt-3 font-display text-4xl text-neutral-900 sm:text-5xl">
                  Soft<br />
                  <span className="italic text-rosa-500">romance</span>
                </p>
                <p className="mt-3 text-xs text-neutral-600">
                  Cápsula limitada · disponible ahora
                </p>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-xl sm:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rosa-400 to-menta-300" />
              <div>
                <p className="text-xs tracking-[0.2em] text-neutral-500">NUEVO</p>
                <p className="text-sm text-neutral-900">Colección primavera</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
