import { redirect } from "next/navigation";

import { getCurrentUser } from "@features/auth/actions";
import { Footer } from "@shared/layout/Footer";
import { Header } from "@shared/layout/Header";

export default async function PrivadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/cuenta");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
