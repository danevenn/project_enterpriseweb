"use client";

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/site/project-card";
import type { Project, ProjectCategory } from "@/data/projects";
import { cn } from "@/lib/utils";
import { fadeUp, onceInView, staggerContainer } from "@/lib/motion";

type Filter = "all" | ProjectCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "Muebles a medida", label: "Muebles a medida" },
  { id: "Restauración", label: "Restauración" },
  { id: "Carpintería estructural", label: "Estructural" },
];

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () =>
      filter === "all" ? projects : projects.filter((p) => p.category === filter),
    [projects, filter],
  );

  return (
    <LayoutGroup>
      <div
        role="tablist"
        aria-label="Filtrar por categoría"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.id)}
              className={cn(
                "relative rounded-full border px-4 py-1.5 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "border-accent/40 text-accent-foreground"
                  : "border-border/60 text-foreground/70 hover:border-accent/30 hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        layout
        initial="hidden"
        whileInView="visible"
        viewport={onceInView}
        variants={staggerContainer}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, idx) => (
            <motion.div
              key={project.slug}
              layout
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
              transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            >
              <ProjectCard project={project} priority={idx < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">
          No hay proyectos en esta categoría todavía.
        </p>
      )}
    </LayoutGroup>
  );
}
