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
      className={`admin-root ${spaceGrotesk.variable} ${spaceMono.variable} min-h-screen`}
      style={{ backgroundColor: "#fafaf8", color: "#1f1c19" }}
    >
      <style>{`
        .admin-root { font-family: var(--font-admin-sans), ui-sans-serif, system-ui; }
        .admin-root .font-mono { font-family: var(--font-admin-mono), ui-monospace, monospace; }
        .admin-root * { -webkit-font-smoothing: antialiased; }

        /* Rosa y Menta palette overrides for admin */
        .admin-root .bg-black { background-color: #fafaf8 !important; }
        .admin-root .bg-neutral-950 { background-color: #ffffff !important; }
        .admin-root .bg-neutral-900 { background-color: #f3f1ec !important; }
        .admin-root .bg-black\\/80 { background-color: rgba(31,28,25,0.75) !important; }
        .admin-root .bg-black\\/60 { background-color: rgba(31,28,25,0.55) !important; }

        .admin-root .text-white { color: #1f1c19 !important; }
        .admin-root .text-neutral-300 { color: #4d4945 !important; }
        .admin-root .text-neutral-400 { color: #65605a !important; }
        .admin-root .text-neutral-500 { color: #847b70 !important; }
        .admin-root .text-neutral-600 { color: #a8a095 !important; }
        .admin-root .text-neutral-700 { color: #cfc9bf !important; }

        .admin-root .border-white { border-color: #c97b84 !important; }
        .admin-root .border-neutral-900 { border-color: #e7e3dc !important; }
        .admin-root .border-neutral-800 { border-color: #e7e3dc !important; }
        .admin-root .border-neutral-700 { border-color: #cfc9bf !important; }
        .admin-root .divide-neutral-900 > :not([hidden]) ~ :not([hidden]) { border-color: #e7e3dc !important; }

        /* Accent red → rosa-500 */
        .admin-root [class*="text-[#D71921]"], .admin-root .text-\\[\\#D71921\\] { color: #c97b84 !important; }
        .admin-root [class*="bg-[#D71921]"], .admin-root .bg-\\[\\#D71921\\] { background-color: #c97b84 !important; }
        .admin-root [class*="border-[#D71921]"], .admin-root .border-\\[\\#D71921\\] { border-color: #c97b84 !important; }

        /* Success green → menta-500 */
        .admin-root [class*="text-[#00C853]"], .admin-root .text-\\[\\#00C853\\] { color: #53a17a !important; }
        .admin-root [class*="bg-[#00C853]"], .admin-root .bg-\\[\\#00C853\\] { background-color: #53a17a !important; }

        /* Primary button hover: white/black → rosa */
        .admin-root .hover\\:bg-white:hover { background-color: #c97b84 !important; }
        .admin-root .hover\\:text-black:hover { color: #ffffff !important; }
        .admin-root .hover\\:text-white:hover { color: #ffffff !important; }

        /* Inputs placeholder legibility */
        .admin-root input, .admin-root select, .admin-root textarea { color: #1f1c19; }
        .admin-root input::placeholder, .admin-root textarea::placeholder { color: #a8a095; }

        /* Focus ring accent */
        .admin-root *:focus-visible { outline-color: #c97b84 !important; }
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
