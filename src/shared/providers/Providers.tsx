"use client";

// Providers client-side globales. Vive en un "use client" porque registra
// toasters y efectos de hidratación de stores Zustand en el cliente.

import * as Toast from "@radix-ui/react-toast";
import { type ReactNode } from "react";

import { CartDrawer } from "@features/cart/components/CartDrawer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider swipeDirection="right" duration={4500}>
      {children}
      <CartDrawer />
      <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[360px] max-w-[100vw] flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
}
