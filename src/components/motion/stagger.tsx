"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import {
  fadeUp,
  onceInView,
  staggerContainer,
  staggerContainerSlow,
} from "@/lib/motion";

type StaggerProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  as?: "div" | "section" | "ul" | "ol";
  speed?: "default" | "slow";
};

export function Stagger({
  children,
  as = "div",
  speed = "default",
  ...rest
}: StaggerProps) {
  const MotionTag = motion[as] as typeof motion.div;
  const variants = speed === "slow" ? staggerContainerSlow : staggerContainer;
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={onceInView}
      variants={variants}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  as?: "div" | "li" | "article" | "section";
};

export function StaggerItem({
  children,
  as = "div",
  ...rest
}: StaggerItemProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag variants={fadeUp} {...rest}>
      {children}
    </MotionTag>
  );
}
