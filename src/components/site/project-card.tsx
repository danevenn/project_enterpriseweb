"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Mousemove parallax sobre la imagen
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.4 });
  // Convertimos a desplazamiento sutil (max ±6 px)
  const tx = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const ty = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  const handleMove = (e: React.PointerEvent) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={`Ver proyecto: ${project.title}`}
    >
      <Card className="overflow-hidden border-border/60 transition-all duration-500 hover:-translate-y-1 hover:border-accent hover:shadow-xl pt-0 gap-0">
        <div
          ref={ref}
          className="relative aspect-[4/3] w-full overflow-hidden"
          onPointerMove={handleMove}
          onPointerLeave={reset}
        >
          <motion.div
            style={{ x: tx, y: ty }}
            className="absolute inset-[-6%] will-change-transform"
          >
            <Image
              src={project.image}
              alt={`Imagen del proyecto ${project.title}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={project.blurDataURL}
              priority={priority}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute left-3 top-3 -translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <Badge className="bg-background/90 text-foreground shadow-sm backdrop-blur">
              {project.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="secondary" className="font-normal">
              {project.category}
            </Badge>
            <span>{project.year}</span>
          </div>
          <h3 className="mt-3 flex items-center justify-between gap-3 font-heading text-lg font-semibold leading-snug">
            <span>{project.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {project.shortDescription}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
