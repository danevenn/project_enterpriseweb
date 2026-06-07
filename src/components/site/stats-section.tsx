"use client";

import { motion } from "motion/react";
import { createElement } from "react";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { getIcon } from "@/lib/icon-map";
import { fadeUp, onceInView, staggerContainer } from "@/lib/motion";
import type { Stat } from "@/data/stats";

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <motion.dl
      initial="hidden"
      whileInView="visible"
      viewport={onceInView}
      variants={staggerContainer}
      className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4"
    >
      {stats.map((stat) => {
        return (
          <motion.div
            key={stat.id}
            variants={fadeUp}
            className="group/stat flex flex-col items-start"
          >
            <span
              aria-hidden
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors group-hover/stat:bg-accent/20"
            >
              {createElement(getIcon(stat.icon), { className: "h-4 w-4" })}
            </span>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="mt-5 font-heading text-5xl font-bold leading-none tracking-tight text-foreground md:text-6xl">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </dd>
            <p className="mt-3 text-sm font-medium text-foreground/85">
              {stat.label}
            </p>
            {stat.description && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {stat.description}
              </p>
            )}
          </motion.div>
        );
      })}
    </motion.dl>
  );
}
