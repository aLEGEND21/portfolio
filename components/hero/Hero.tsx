"use client";

import { ChevronDown } from "lucide-react";
import { useRef } from "react";

import { Globe } from "@/components/hero/Globe";
import { ScrollToProjectsButton } from "@/components/hero/ScrollToProjectsButton";
import { Typewriter } from "@/components/hero/Typewriter";
import {
  useHydrated,
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/hooks/useMediaQuery";
import { useScrollY } from "@/lib/hooks/useScrollY";

export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const mobileGlobeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // Mount the (single) globe instance only after the breakpoint is known,
  // so we never run two WebGL contexts for the desktop + mobile slots.
  const hydrated = useHydrated();

  useScrollY((y) => {
    const text = textRef.current;
    const globe = globeRef.current;
    const mobileGlobe = mobileGlobeRef.current;
    if (reducedMotion) return;
    const fadeDistance = window.innerHeight * 0.7;
    const opacity = String(Math.max(0, 1 - y / fadeDistance));
    if (text) {
      text.style.transform = `translateY(${y * -0.15}px)`;
      text.style.opacity = opacity;
    }
    // Globe moves faster than the text so both clear together.
    if (globe) {
      globe.style.transform = `translateY(${y * -0.35}px)`;
      globe.style.opacity = opacity;
    }
    // On mobile the globe lags the scroll — still rising on screen, just
    // slower — and fades out fully right as the projects header (~1vh + its
    // padding into the page) is about to reach the top and overlap it.
    if (mobileGlobe) {
      mobileGlobe.style.transform = `translateY(${y * 0.25}px)`;
      mobileGlobe.style.opacity = String(
        Math.max(0, 1 - y / window.innerHeight)
      );
    }
  });

  return (
    <section id="hero" className="relative overflow-x-clip">
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-10 pt-6 pb-16 md:flex-row md:gap-0 md:pt-0 md:pb-0">
        <div
          ref={globeRef}
          className="pointer-events-none absolute inset-y-0 right-[-4%] hidden w-[55%] items-center justify-end will-change-transform md:flex lg:right-[4%]"
        >
          {hydrated && isDesktop && <Globe className="max-w-[640px]" />}
        </div>
        <div
          ref={textRef}
          className="relative z-10 mx-auto w-full max-w-[1400px] px-6 text-center will-change-transform md:px-12 md:text-left"
        >
          <p className="font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            Software Engineer — Cary, NC
          </p>
          <h1 className="mt-4 font-display text-[44px] leading-[1.1] md:text-[80px]">
            Arnav Murthi
          </h1>
          <p className="mt-5 font-mono text-base leading-[1.4] md:text-xl">
            <Typewriter />
          </p>
          <p className="mx-auto mt-6 max-w-[480px] px-4 text-base leading-[1.6] text-muted-foreground md:mx-0 md:px-0 md:text-lg">
            I build products end-to-end, taking them from idea to thousands of
            users.
          </p>
        </div>

        {/* On mobile the globe shares the first viewport with the text. */}
        <div
          ref={mobileGlobeRef}
          className="flex w-full justify-center px-10 md:hidden"
        >
          {hydrated && !isDesktop && <Globe className="max-w-[280px]" />}
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-8 hidden justify-center md:flex"
        >
          <ChevronDown className="size-5 animate-cue-bounce text-faint motion-reduce:animate-none" />
        </div>
      </div>

      <ScrollToProjectsButton />
    </section>
  );
}
