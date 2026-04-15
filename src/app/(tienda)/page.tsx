import { getCategorias, getDestacados } from "@features/catalog/api";

import { CategoriasMosaico } from "@features/home/components/CategoriasMosaico";
import { DestacadosRow } from "@features/home/components/DestacadosRow";
import { Hero } from "@features/home/components/Hero";
import { NewsletterCTA } from "@features/home/components/NewsletterCTA";
import { SectionHeader } from "@features/home/components/SectionHeader";
import { Ventajas } from "@features/home/components/Ventajas";

export const revalidate = 300;

export default async function HomePage() {
  const [destacados, categorias] = await Promise.all([
    getDestacados(8),
    getCategorias(),
  ]);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader
          eyebrow="CATEGORÍAS"
          title="Explora por estilo"
          subtitle="Encuentra la categoría que mejor va con tu momento."
          cta={{ href: "/catalogo", label: "Ver catálogo completo" }}
        />
        <div className="mt-10">
          <CategoriasMosaico categorias={categorias} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader
          eyebrow="DESTACADOS"
          title="Lo más deseado"
          subtitle="Piezas que se están agotando rápido."
          cta={{ href: "/catalogo?destacado=true", label: "Ver todos" }}
        />
        <div className="mt-10">
          <DestacadosRow productos={destacados} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader
          eyebrow="POR QUÉ ROSA Y MENTA"
          title="Una experiencia distinta"
        />
        <div className="mt-10">
          <Ventajas />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <NewsletterCTA />
      </section>
    </>
  );
}
