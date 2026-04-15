"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Envíos a todo México",
    desc: "Gratis en CDMX desde $999 MXN.",
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    desc: "Confirmación por WhatsApp y transferencia.",
  },
  {
    icon: Sparkles,
    title: "Curaduría 100%",
    desc: "Cada pieza se selecciona con intención.",
  },
  {
    icon: HeartHandshake,
    title: "Atención humana",
    desc: "Te acompañamos en cada paso.",
  },
];

export function Ventajas() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map((it, i) => (
        <motion.li
          key={it.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: i * 0.08 }}
          className="group rounded-2xl bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rosa-50 text-rosa-500 transition group-hover:bg-rosa-500 group-hover:text-white">
            <it.icon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm text-neutral-900">{it.title}</h3>
          <p className="mt-1 text-xs text-neutral-600">{it.desc}</p>
        </motion.li>
      ))}
    </ul>
  );
}
