import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@features/auth/actions";
import { CheckoutForm } from "@features/checkout/components/CheckoutForm";
import { listDirecciones } from "@features/direcciones/api";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirma tu pedido.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  const direcciones = await listDirecciones();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] text-neutral-500">CHECKOUT</p>
        <h1 className="mt-2 text-4xl text-rosa-500">Confirma tu pedido</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Hola {user.first_name}, revisa los datos antes de finalizar.
        </p>
      </header>

      <CheckoutForm direcciones={direcciones} />
    </main>
  );
}
