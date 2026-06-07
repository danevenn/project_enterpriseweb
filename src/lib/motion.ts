"use client";

import type { Variants } from "motion/react";

/**
 * Variants reutilizables para entradas con fade + slide-up sutil.
 * Pensados para usarse con `whileInView` y `viewport={{ once: true, amount: 0.2 }}`.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/**
 * Stagger container: orquesta hijos con un retraso secuencial.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

/**
 * Variants para texto animado palabra a palabra.
 */
export const wordVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Viewport por defecto: una sola vez, cuando el 20% es visible. */
export const onceInView = { once: true, amount: 0.2 } as const;
