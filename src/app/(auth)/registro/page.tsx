import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta en Rosa y Menta para comprar y guardar favoritos.",
  robots: { index: false, follow: false },
};

export default function RegistroPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.3em] text-neutral-500">REGISTRO</p>
      <h1 className="mt-2 text-4xl text-rosa-500">Crea tu cuenta</h1>
      <p className="mt-2 text-sm text-neutral-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-rosa-500 hover:underline">
          Inicia sesión
        </Link>
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
