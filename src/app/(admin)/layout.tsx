import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Space_Grotesk, Space_Mono } from "next/font/google";

import { getCurrentUser } from "@features/auth/actions";

import { AdminSidebar } from "@features/admin/components/AdminSidebar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-admin-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-admin-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!user.is_staff) redirect("/");

  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <div
      className={`admin-root ${spaceGrotesk.variable} ${spaceMono.variable} min-h-screen bg-black text-white`}
    >
      <style>{`
        .admin-root { font-family: var(--font-admin-sans), ui-sans-serif, system-ui; }
        .admin-root .font-mono { font-family: var(--font-admin-mono), ui-monospace, monospace; }
        .admin-root * { -webkit-font-smoothing: antialiased; }
      `}</style>
      <AdminSidebar userName={displayName} />
      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl px-6 py-10 pt-20 md:px-10 md:pt-12">
          {children}
        </div>
      </main>
    </div>
  );
}
