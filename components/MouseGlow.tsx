"use client";

import { useEffect, useRef } from "react";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Faint circle of light on the page background that trails the cursor.
// Desktop (hover-capable) only; sits beneath all content.
export function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const canHover = useMediaQuery("(hover: hover)");

  useEffect(() => {
    if (!canHover) return;
    let rafId = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const el = ref.current;
        if (!el) return;
        el.style.background = `radial-gradient(110px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.03) 40%, transparent 75%)`;
        el.style.opacity = "1";
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [canHover]);

  if (!canHover) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-0 transition-opacity duration-500"
    />
  );
}
