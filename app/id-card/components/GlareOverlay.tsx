"use client";

import { motion, useMotionTemplate, type MotionValue } from "motion/react";

// Soft pale bloom whose center follows the spring-smoothed glare position
// from useTilt. Sits above the card content but never intercepts clicks.
export function GlareOverlay({
  glareX,
  glareY,
}: {
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
}) {
  const background = useMotionTemplate`radial-gradient(130% 90% at ${glareX}% ${glareY}%, var(--highlight) 0%, rgba(251, 240, 220, 0) 55%)`;
  return (
    <motion.div
      aria-hidden
      style={{ background }}
      className="pointer-events-none absolute inset-0 rounded-[var(--card-radius)] opacity-45 mix-blend-soft-light"
    />
  );
}
