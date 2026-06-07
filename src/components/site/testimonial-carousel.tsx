"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const total = testimonials.length;

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(((next % total) + total) % total);
    },
    [index, total],
  );

  // Autoplay (pausa si reduce-motion).
  useEffect(() => {
    if (reduced || total <= 1) return;
    const t = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, 6500);
    return () => clearInterval(t);
  }, [reduced, total]);

  if (total === 0) return null;
  const t = testimonials[index];

  return (
    <div className="relative mx-auto max-w-3xl">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-6 font-heading text-[8rem] leading-none text-accent/15 md:-left-8 md:text-[10rem]"
      >
        “
      </span>

      <div className="relative min-h-[14rem] md:min-h-[12rem]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.figure
            key={t.id}
            custom={direction}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Quote
              className="mb-4 h-6 w-6 text-accent/60"
              aria-hidden
            />
            <blockquote className="font-heading text-2xl leading-snug text-foreground md:text-3xl">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <span
                aria-hidden
                className="h-px w-10 bg-accent"
              />
              <div className="text-sm">
                <p className="font-semibold text-foreground">{t.author}</p>
                <p className="text-muted-foreground">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div
          className="mt-8 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Testimonios"
        >
          {testimonials.map((tt, i) => (
            <button
              key={tt.id}
              role="tab"
              type="button"
              aria-selected={i === index}
              aria-label={`Testimonio ${i + 1} de ${total}`}
              onClick={() => go(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                i === index
                  ? "w-8 bg-accent"
                  : "w-1.5 bg-foreground/20 hover:bg-foreground/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
