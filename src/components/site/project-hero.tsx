"use client";

import Image from "next/image";
import { motion } from "motion/react";

type Props = {
  src: string;
  alt: string;
  blurDataURL: string;
};

/**
 * Hero del detalle de proyecto: fade + scale ligero al entrar.
 */
export function ProjectHero({ src, alt, blurDataURL }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-foreground/10"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 64rem, 100vw"
        placeholder="blur"
        blurDataURL={blurDataURL}
        priority
        className="object-cover"
      />
    </motion.div>
  );
}
