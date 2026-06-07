"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { ProjectPhase } from "@/data/projects";
import { fadeUp, onceInView, staggerContainerSlow } from "@/lib/motion";

/**
 * Timeline vertical animada: línea que se rellena según se hace scroll.
 */
export function ProcessTimeline({ phases }: { phases: ProjectPhase[] }) {
  const containerRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 25%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.ol
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={onceInView}
      variants={staggerContainerSlow}
      className="relative space-y-10 pl-10 md:pl-14"
    >
      {/* Línea base (gris) */}
      <span
        aria-hidden
        className="absolute left-3 top-2 h-full w-px bg-border md:left-5"
      />
      {/* Línea que se rellena */}
      <motion.span
        aria-hidden
        style={{ height: lineHeight }}
        className="absolute left-3 top-2 w-px bg-accent md:left-5"
      />

      {phases.map((phase, i) => (
        <motion.li
          key={`${phase.phase}-${i}`}
          variants={fadeUp}
          className="relative"
        >
          {/* Bullet */}
          <span
            aria-hidden
            className="absolute -left-10 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-accent/40 bg-background font-mono text-[10px] font-medium text-accent md:-left-14 md:h-7 md:w-7 md:text-xs"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="font-heading text-lg font-semibold md:text-xl">
              {phase.phase}
            </h3>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {phase.weeks} sem.
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
            {phase.description}
          </p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
