import { redirect } from "next/navigation";

import { getCurrentUser } from "@features/auth/actions";
import { CuentaNav } from "@features/account/components/CuentaNav";
import { LogoutButton } from "@features/account/components/LogoutButton";

export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/cuenta");

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-neutral-500">MI CUENTA</p>
          <h1 className="mt-1 text-3xl text-rosa-500">
            Hola, {user.first_name}
          </h1>
        </div>
        <LogoutButton />
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl bg-white p-4">
          <CuentaNav />
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
