import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de Rosa y Menta.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.3em] text-neutral-500">ACCESO</p>
      <h1 className="mt-2 text-4xl text-rosa-500">Bienvenida de nuevo</h1>
      <p className="mt-2 text-sm text-neutral-600">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/registro" className="text-rosa-500 hover:underline">
          Regístrate
        </Link>
      </p>

      <div className="mt-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
