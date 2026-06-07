"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState, createElement } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getIcon } from "@/lib/icon-map";
import { onceInView, staggerContainer, fadeUp } from "@/lib/motion";
import type { Service } from "@/data/services";

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={onceInView}
      variants={staggerContainer}
      className="mt-12 grid gap-6 md:grid-cols-3"
    >
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </motion.div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="h-full"
    >
      <Card className="h-full border-border/60 transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl">
        <CardContent className="flex h-full flex-col gap-4 py-6">
          <motion.span
            animate={{ rotate: hovered ? 8 : 0, scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent"
            aria-hidden
          >
            {createElement(getIcon(service.icon), { className: "h-5 w-5" })}
          </motion.span>

          <div>
            <h3 className="font-heading text-xl font-semibold">
              {service.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {service.tagline}
            </p>
          </div>

          <motion.ul
            initial={false}
            animate={{
              height: hovered ? "auto" : 0,
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden text-sm text-foreground/80"
            aria-hidden={!hovered}
          >
            <li className="pt-1" aria-hidden />
            {service.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-2 py-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                <span>{f}</span>
              </li>
            ))}
          </motion.ul>

          {service.startingFrom && (
            <p className="mt-auto pt-2 text-xs uppercase tracking-wider text-accent/80">
              {service.startingFrom}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
