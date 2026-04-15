import { listCategorias, listMarcas } from "@features/admin/api";
import { PageHeader } from "@features/admin/components/PageHeader";
import { ProductoForm } from "@features/admin/components/ProductoForm";
import type { Categoria, Marca, Paginated } from "@features/admin/types";

export const dynamic = "force-dynamic";

function unwrap<T>(x: T[] | Paginated<T>): T[] {
  if (Array.isArray(x)) return x;
  return Array.isArray(x?.results) ? x.results : [];
}

export default async function NuevoProductoPage() {
  const [cats, marcas] = await Promise.all([
    listCategorias().catch(() => [] as Categoria[]),
    listMarcas().catch(() => [] as Marca[]),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        code="01.NEW"
        title="Nuevo producto"
        description="Crea el registro base. Después sube al menos 4 imágenes para poder activarlo."
      />
      <ProductoForm categorias={unwrap(cats)} marcas={unwrap(marcas)} />
    </div>
  );
}
