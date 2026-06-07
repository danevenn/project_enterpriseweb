import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  Hammer,
  MapPin,
  Ruler,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import {
  getAllProjects,
  getProjectBySlug,
  getRelatedProjects,
} from "@/data/projects";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ProjectHero } from "@/components/site/project-hero";
import { ProcessTimeline } from "@/components/site/process-timeline";
import { ProjectGallery } from "@/components/site/project-gallery";
import { ProjectTestimonialBlock } from "@/components/site/project-testimonial";
import { ProjectCard } from "@/components/site/project-card";

type Params = { slug: string };

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Proyecto no encontrado" };
  }
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [{ url: project.image, alt: project.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
      images: [project.image],
    },
  };
}

function formatDimensions(d: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>["dimensions"]): string {
  if (!d) return "";
  const u = d.unit;
  const parts: string[] = [];
  if (d.width !== undefined) parts.push(`${d.width} ${u}`);
  if (d.height !== undefined) parts.push(`${d.height} ${u}`);
  if (d.depth !== undefined) parts.push(`${d.depth} ${u}`);
  return parts.join(" × ");
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(slug, 3);

  return (
    <article className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <ButtonLink href="/proyectos" variant="ghost" size="sm" className="mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Volver a la galería
      </ButtonLink>

      <Reveal as="header" className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Badge variant="secondary" className="mb-3">
            {project.category}
          </Badge>
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {project.shortDescription}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-4 text-sm md:gap-6">
          <div>
            <dt className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Año
            </dt>
            <dd className="mt-1 font-semibold">{project.year}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-muted-foreground">
              <Hammer className="h-3.5 w-3.5" /> Duración
            </dt>
            <dd className="mt-1 font-semibold">{project.durationWeeks} sem.</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Cliente
            </dt>
            <dd className="mt-1 font-semibold">{project.client}</dd>
          </div>
        </dl>
      </Reveal>

      <ProjectHero
        src={project.image}
        alt={`Vista principal del proyecto ${project.title}`}
        blurDataURL={project.blurDataURL}
      />

      <div className="mt-12 grid gap-12 md:grid-cols-[2fr_1fr]">
        <Reveal as="section">
          <h2 className="font-heading text-2xl font-semibold">
            Sobre el proyecto
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-foreground/85">
            {project.description.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal as="div" delay={0.1} className="space-y-8">
          <section>
            <h2 className="font-heading text-xl font-semibold">Materiales</h2>
            <ul className="mt-4 space-y-2">
              {project.materials.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-2 text-sm text-foreground/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {m}
                </li>
              ))}
            </ul>
          </section>

          {project.dimensions && (
            <section>
              <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
                <Ruler className="h-4 w-4 text-accent" />
                Dimensiones
              </h2>
              <p className="mt-3 font-mono text-sm text-foreground/80">
                {formatDimensions(project.dimensions)}
              </p>
            </section>
          )}

          {project.tags && project.tags.length > 0 && (
            <section>
              <h2 className="font-heading text-xl font-semibold">Etiquetas</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Reveal>
      </div>

      {(project.techniques?.length || project.challenges?.length) && (
        <>
          <Separator className="my-14" />
          <div className="grid gap-10 md:grid-cols-2">
            {project.techniques && project.techniques.length > 0 && (
              <Reveal as="section">
                <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Técnicas
                </h2>
                <Stagger as="ul" className="mt-5 space-y-3">
                  {project.techniques.map((t) => (
                    <StaggerItem
                      key={t}
                      as="li"
                      className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/50 p-3"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-sm text-foreground/85">{t}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </Reveal>
            )}

            {project.challenges && project.challenges.length > 0 && (
              <Reveal as="section" delay={0.1}>
                <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  Retos resueltos
                </h2>
                <Stagger as="ul" className="mt-5 space-y-3">
                  {project.challenges.map((c) => (
                    <StaggerItem
                      key={c}
                      as="li"
                      className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/50 p-3"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-sm text-foreground/85">{c}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </Reveal>
            )}
          </div>
        </>
      )}

      {project.process && project.process.length > 0 && (
        <>
          <Separator className="my-14" />
          <section>
            <Reveal>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">
                Proceso
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold">
                De la idea a la pieza
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Las fases por las que pasa este encargo, desde el primer
                boceto hasta la entrega.
              </p>
            </Reveal>
            <div className="mt-10">
              <ProcessTimeline phases={project.process} />
            </div>
          </section>
        </>
      )}

      {project.gallery.length > 1 && (
        <>
          <Separator className="my-14" />
          <section>
            <Reveal>
              <h2 className="font-heading text-2xl font-semibold">
                Más imágenes
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pulsa cualquier imagen para ampliarla.
              </p>
            </Reveal>
            <div className="mt-8">
              <ProjectGallery
                images={project.gallery}
                blurDataURL={project.blurDataURL}
                title={project.title}
              />
            </div>
          </section>
        </>
      )}

      {project.testimonial && (
        <>
          <Separator className="my-14" />
          <section>
            <ProjectTestimonialBlock testimonial={project.testimonial} />
          </section>
        </>
      )}

      {related.length > 0 && (
        <>
          <Separator className="my-14" />
          <section>
            <Reveal>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">
                Continúa explorando
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold md:text-3xl">
                Proyectos relacionados
              </h2>
            </Reveal>
            <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <StaggerItem key={p.slug}>
                  <ProjectCard project={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        </>
      )}

      <Reveal className="mt-16 overflow-hidden rounded-2xl bg-secondary/40 p-8 text-center md:p-12">
        <h2 className="font-heading text-2xl font-semibold md:text-3xl">
          ¿Tienes en mente un proyecto similar?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Hablemos sin compromiso. Estudiamos cada encargo con tiempo.
        </p>
        <ButtonLink href="/contacto" className="mt-5" size="lg">
          Solicitar presupuesto
        </ButtonLink>
      </Reveal>
    </article>
  );
}
