import { listCategorias, listMarcas } from "@features/admin/api";
import { CategoriasManager, MarcasManager } from "@features/admin/components/CatalogoForms";
import { PageHeader } from "@features/admin/components/PageHeader";
import { StatCard } from "@features/admin/components/StatCard";
import type { Categoria, Marca, Paginated } from "@features/admin/types";

export const dynamic = "force-dynamic";

function unwrap<T>(x: T[] | Paginated<T>): T[] {
  if (Array.isArray(x)) return x;
  return Array.isArray(x?.results) ? x.results : [];
}

export default async function CatalogoPage() {
  const [cats, marcas] = await Promise.all([
    listCategorias().catch(() => [] as Categoria[]),
    listMarcas().catch(() => [] as Marca[]),
  ]);

  const categorias = unwrap(cats);
  const marcasList = unwrap(marcas);

  return (
    <div className="space-y-10">
      <PageHeader
        code="1B"
        title="Catálogo"
        description="Categorías y marcas disponibles para productos."
      />

      <section className="grid grid-cols-2 gap-px bg-neutral-900">
        <StatCard code="01" label="Categorías" value={categorias.length} />
        <StatCard code="02" label="Marcas" value={marcasList.length} />
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <CategoriasManager items={categorias} />
        <MarcasManager items={marcasList} />
      </div>
    </div>
  );
}
