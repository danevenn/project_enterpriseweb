"use client";

import { motion } from "motion/react";
import type { ProjectTestimonial } from "@/data/projects";
import { onceInView } from "@/lib/motion";

export function ProjectTestimonialBlock({
  testimonial,
}: {
  testimonial: ProjectTestimonial;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={onceInView}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-3xl rounded-3xl border border-border/60 bg-secondary/40 p-8 md:p-12"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-2 font-heading text-[7rem] leading-none text-accent/20 md:left-6 md:text-[9rem]"
      >
        “
      </span>
      <blockquote className="relative font-heading text-xl leading-snug md:text-2xl">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 text-sm">
        <span aria-hidden className="h-px w-8 bg-accent" />
        <div>
          <p className="font-semibold text-foreground">{testimonial.author}</p>
          <p className="text-muted-foreground">{testimonial.role}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}
