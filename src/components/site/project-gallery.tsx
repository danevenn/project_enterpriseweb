"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { fadeUp, onceInView, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  blurDataURL: string;
  title: string;
};

/**
 * Galería con grid masonry-ish + lightbox modal accesible.
 */
export function ProjectGallery({ images, blurDataURL, title }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={onceInView}
        variants={staggerContainer}
        className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
      >
        {images.map((src, i) => (
          <motion.button
            key={`${src}-${i}`}
            variants={fadeUp}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Abrir imagen ${i + 1} en pantalla completa`}
            className={cn(
              "group relative overflow-hidden rounded-xl ring-1 ring-foreground/10",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              // Masonry-ish: la primera imagen ocupa una celda más alta en md+
              i % 5 === 0
                ? "aspect-[4/3] md:row-span-2 md:aspect-auto md:h-full"
                : "aspect-[4/3]",
            )}
          >
            <Image
              src={src}
              alt={`${title} — imagen ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Vista ampliada de la imagen"
            onClick={close}
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={close}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/40"
            >
              <X className="h-5 w-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Imagen anterior"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/40"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  aria-label="Imagen siguiente"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/40"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <motion.div
              key={open}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full max-h-[88vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[open]}
                alt={`${title} — imagen ${open + 1}`}
                fill
                sizes="90vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="object-contain"
              />
              <p className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs text-white/70">
                {open + 1} / {images.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
