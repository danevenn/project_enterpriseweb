"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  value: number;
  /** Duración total en segundos. */
  duration?: number;
  /** Texto antepuesto (ej: "€", "<"). */
  prefix?: string;
  /** Texto pospuesto (ej: "+", "%"). */
  suffix?: string;
  className?: string;
};

/**
 * Cuenta desde 0 hasta `value` cuando entra en viewport.
 * Honra `prefers-reduced-motion` (muestra el valor final directamente).
 */
export function AnimatedCounter({
  value,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => Math.round(latest));

  useEffect(() => {
    if (!isInView) return;
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [isInView, value, duration, mv, reduced]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const unsub = rounded.on("change", (v) => {
      node.textContent = `${prefix}${v}${suffix}`;
    });
    // Estado inicial
    node.textContent = `${prefix}0${suffix}`;
    return () => unsub();
  }, [rounded, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix}0{suffix}
    </span>
  );
}
