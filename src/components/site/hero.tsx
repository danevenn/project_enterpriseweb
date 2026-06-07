"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { wordVariants } from "@/lib/motion";

const TITLE_PARTS_1 = ["La", "madera"];
const TITLE_PARTS_2 = ["contada", "con", "las", "manos"];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Parallax sutil sobre la imagen (12%) — se desactiva si reduce-motion.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["0%", "12%"],
  );
  const imgScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [1.05, 1.18],
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden"
      aria-label="Presentación de Carpintería Los Artesanos"
    >
      <motion.div
        style={{ y, scale: imgScale }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1567361808960-dec9cb578182?auto=format&fit=crop&w=2000&q=80"
          alt="Taller de carpintería con virutas de madera y herramientas tradicionales"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </motion.div>
      <div className="container mx-auto px-4 py-24 md:py-36">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-sm uppercase tracking-[0.3em] text-accent"
        >
          Taller artesanal desde 1962
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.07, delayChildren: 0.15 }}
          className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl"
        >
          {TITLE_PARTS_1.map((word, i) => (
            <motion.span
              key={`a-${i}`}
              variants={wordVariants}
              className="mr-3 inline-block"
            >
              {word}
            </motion.span>
          ))}
          <br className="hidden md:inline" />
          <span className="text-accent">
            {TITLE_PARTS_2.map((word, i) => (
              <motion.span
                key={`b-${i}`}
                variants={wordVariants}
                className="mr-3 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
          className="mt-6 max-w-xl text-lg text-foreground/80"
        >
          Diseñamos y construimos muebles únicos, restauramos piezas con
          historia y levantamos estructuras de madera que duran generaciones.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <ButtonLink href="/proyectos" size="lg">
            Ver galería de proyectos
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="/contacto" variant="outline" size="lg">
            Solicitar presupuesto
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
