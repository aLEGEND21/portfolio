"use client";

import { ArrowDown } from "lucide-react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { useScrollY } from "@/lib/hooks/useScrollY";

const FADE_DISTANCE = 120;

export function ScrollToProjectsButton() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useScrollY((y) => {
    const el = wrapperRef.current;
    if (!el) return;
    const opacity = Math.max(0, 1 - y / FADE_DISTANCE);
    el.style.opacity = String(opacity);
    el.style.visibility = opacity === 0 ? "hidden" : "visible";
  });

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-x-0 z-40 flex justify-center md:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
    >
      <button
        type="button"
        className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        onClick={() =>
          document.getElementById("projects")?.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
          })
        }
      >
        Highlights
        <ArrowDown className="size-4 animate-cue-bounce motion-reduce:animate-none" />
      </button>
    </div>
  );
}
