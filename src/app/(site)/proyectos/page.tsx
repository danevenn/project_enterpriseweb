import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProjects } from "@/data/projects";
import { ProjectGrid } from "@/components/site/project-grid";
import { ProjectCardSkeleton } from "@/components/site/project-card-skeleton";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Galería de Proyectos",
  description:
    "Selección de muebles a medida, restauraciones y carpintería estructural realizados por Carpintería Los Artesanos.",
};

export const revalidate = 3600;

async function ProjectsGridLoader() {
  const projects = await getAllProjects();
  return <ProjectGrid projects={projects} />;
}

export default function ProyectosPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Reveal as="header" className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          Galería
        </p>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl font-bold">
          Proyectos realizados
        </h1>
        <p className="mt-4 text-muted-foreground">
          Una pequeña muestra del trabajo salido del taller en los últimos
          años. Filtra por categoría o pasa el cursor sobre cualquier proyecto
          para abrir su ficha detallada.
        </p>
      </Reveal>

      <div className="mt-12">
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ProjectsGridLoader />
        </Suspense>
      </div>
    </div>
  );
}
