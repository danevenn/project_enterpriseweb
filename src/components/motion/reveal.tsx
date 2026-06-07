"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, onceInView } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  /** Retraso adicional en segundos */
  delay?: number;
  /** Etiqueta semántica del wrapper */
  as?: "div" | "section" | "article" | "header" | "li" | "ul" | "ol";
};

/**
 * Wrapper cliente para hacer fade+slide-up al entrar en viewport.
 * Respeta `prefers-reduced-motion` automáticamente (motion lo hace).
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  ...rest
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={onceInView}
      variants={fadeUp}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
