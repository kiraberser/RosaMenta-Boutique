import { ADMIN_PAGE_SIZE, listUsuarios } from "@features/admin/api";
import { DataTable } from "@features/admin/components/DataTable";
import { PageHeader } from "@features/admin/components/PageHeader";
import { Pagination } from "@features/admin/components/Pagination";
import { SearchBox } from "@features/admin/components/SearchBox";
import { StatCard } from "@features/admin/components/StatCard";
import type { AdminUsuario, Paginated } from "@features/admin/types";

export const dynamic = "force-dynamic";

function unwrap<T>(x: T[] | Paginated<T>): { rows: T[]; count: number } {
  if (Array.isArray(x)) return { rows: x, count: x.length };
  return { rows: x.results, count: x.count };
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search ?? "";

  const raw = await listUsuarios(page, search).catch(
    () => [] as AdminUsuario[],
  );
  const { rows: usuarios, count } = unwrap(raw);

  const staff = usuarios.filter((u) => u.is_staff).length;
  const newsletter = usuarios.filter((u) => u.acepta_newsletter).length;

  return (
    <div className="space-y-10">
      <PageHeader
        code="06"
        title="Usuarios"
        description={`${count} cuentas registradas en la plataforma.`}
      />

      <section className="grid grid-cols-1 gap-px bg-neutral-900 sm:grid-cols-3">
        <StatCard code="01" label="Total" value={count} />
        <StatCard
          code="02"
          label="Staff · Página"
          value={staff}
          hint="Con acceso al panel"
        />
        <StatCard
          code="03"
          label="Opt-in · Página"
          value={newsletter}
          hint="Al registrarse"
        />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400">
            CUENTAS · [15]
          </h2>
          <SearchBox placeholder="Buscar por email o usuario..." />
        </div>

        <DataTable
          rows={usuarios}
          empty={search ? "Sin coincidencias" : "Sin usuarios"}
          columns={[
            {
              key: "nombre",
              header: "Nombre",
              render: (u) => (
                <div>
                  <p className="text-sm text-white">
                    {[u.first_name, u.last_name].filter(Boolean).join(" ") ||
                      u.username}
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-neutral-600">
                    @{u.username}
                  </p>
                </div>
              ),
            },
            {
              key: "email",
              header: "Email",
              render: (u) => (
                <span className="font-mono text-[11px] text-neutral-300">
                  {u.email}
                </span>
              ),
            },
            {
              key: "rol",
              header: "Rol",
              render: (u) => (
                <span
                  className={`font-mono text-[10px] tracking-[0.25em] ${
                    u.is_staff ? "text-[#D71921]" : "text-neutral-500"
                  }`}
                >
                  {u.is_staff ? "● STAFF" : "○ CLIENTE"}
                </span>
              ),
            },
            {
              key: "fecha",
              header: "Registro",
              render: (u) => (
                <span className="font-mono text-[11px] text-neutral-500">
                  {new Date(u.date_joined).toLocaleDateString("es-MX")}
                </span>
              ),
            },
          ]}
        />

        <Pagination page={page} count={count} pageSize={ADMIN_PAGE_SIZE} />
      </section>
    </div>
  );
}
