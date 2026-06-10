"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Calm, accessible fade-up reveal used across sections.
 * Animates once when scrolled into view; respects prefers-reduced-motion
 * via framer-motion's global reducer.
 */

const SHARED = (delay: number, y: number) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const props = { className, ...SHARED(delay, y) };

  if (as === "li")   return <motion.li   {...props}>{children}</motion.li>;
  if (as === "span") return <motion.span {...props}>{children}</motion.span>;
  return               <motion.div  {...props}>{children}</motion.div>;
}
