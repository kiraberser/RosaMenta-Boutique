"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartLine } from "../types";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  hydrated: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (line: CartLine) => void;
  updateQty: (varianteId: number, cantidad: number) => void;
  remove: (varianteId: number) => void;
  clear: () => void;
  setLines: (lines: CartLine[]) => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      hydrated: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.varianteId === line.varianteId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.varianteId === line.varianteId
                  ? { ...l, cantidad: l.cantidad + line.cantidad }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),
      updateQty: (varianteId, cantidad) =>
        set((state) => ({
          lines:
            cantidad <= 0
              ? state.lines.filter((l) => l.varianteId !== varianteId)
              : state.lines.map((l) =>
                  l.varianteId === varianteId ? { ...l, cantidad } : l,
                ),
        })),
      remove: (varianteId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.varianteId !== varianteId),
        })),
      clear: () => set({ lines: [] }),
      setLines: (lines) => set({ lines }),
      totalItems: () => get().lines.reduce((acc, l) => acc + l.cantidad, 0),
      subtotal: () =>
        get().lines.reduce((acc, l) => acc + l.precio * l.cantidad, 0),
    }),
    {
      name: "rm-cart",
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
