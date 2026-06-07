import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Hero } from "@/components/site/hero";
import { ServicesSection } from "@/components/site/services-section";
import { StatsSection } from "@/components/site/stats-section";
import { FeaturedProjects } from "@/components/site/featured-projects";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { ProjectCardSkeleton } from "@/components/site/project-card-skeleton";
import { Reveal } from "@/components/motion/reveal";
import { getAllServices } from "@/data/services";
import { getAllStats } from "@/data/stats";
import { getFeaturedTestimonials } from "@/data/testimonials";

export default async function HomePage() {
  const [services, stats, testimonials] = await Promise.all([
    getAllServices(),
    getAllStats(),
    getFeaturedTestimonials(4),
  ]);

  return (
    <>
      <Hero />

      <section className="container mx-auto px-4 py-20 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Qué hacemos
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">
            Tres oficios, una misma mano
          </h2>
          <p className="mt-3 text-muted-foreground">
            Diseñamos, restauramos y construimos en madera. Cada encargo recibe
            el mismo cuidado, sin importar su escala.
          </p>
        </Reveal>
        <ServicesSection services={services} />
      </section>

      <section className="border-y border-border/60 bg-secondary/30 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              El taller en números
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">
              Trabajos, años y maderas
            </h2>
          </Reveal>
          <div className="mt-14 md:mt-16">
            <StatsSection stats={stats} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              Selección
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">
              Proyectos destacados
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Una muestra de los encargos más recientes salidos del taller.
            </p>
          </div>
          <ButtonLink href="/proyectos" variant="ghost">
            Ver todos <ArrowRight className="ml-1 h-4 w-4" />
          </ButtonLink>
        </Reveal>

        <Suspense
          fallback={
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          }
        >
          <FeaturedProjects />
        </Suspense>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-secondary/30 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">
                Voces del taller
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">
                Lo que cuentan quienes nos encargan
              </h2>
            </Reveal>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-24 md:py-32">
        <Reveal className="relative mx-auto overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground md:px-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--color-accent)_0%,_transparent_60%)] opacity-20"
          />
          <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/70">
            Hablemos
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-heading text-3xl font-semibold md:text-5xl">
            Tienes una idea. Nosotros, el tiempo para escucharla.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Estudiamos cada encargo en detalle. Un café, una visita y, si
            encajamos, una pieza que dure generaciones.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contacto" size="lg" variant="secondary">
              Solicitar presupuesto
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/proyectos" size="lg" variant="ghost">
              Ver proyectos
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
