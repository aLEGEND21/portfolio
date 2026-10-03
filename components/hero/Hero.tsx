"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";

import { profile } from "@/app/id-card/profile";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { HeroCard } from "@/components/hero/HeroCard";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { useScrollY } from "@/lib/hooks/useScrollY";
import { cn } from "@/lib/utils";

// Staggered load-in; tw-animate-css utilities, skipped under reduced motion.
const rise =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-700 motion-safe:ease-out";

// Where the content's bottom edge sits, as a fraction of the viewport, at
// the moment it fully fades and meets the projects label — near the top of
// the screen, so the label has nearly arrived by the time the hero is gone.
const EXIT_LINE = 0.06;

function pageTop(el: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

type ExitMetrics = { start: number; lag: number; fadeDistance: number };

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  // Layout-derived scroll-out constants; cleared on resize and re-measured
  // on the next frame, so scrolling itself does no layout reads.
  const metrics = useRef<ExitMetrics | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Scroll-out: the hero content lags the scroll (still rising, just
  // slower) and fades, timed from the layout so it reaches zero opacity
  // right as its lowest edge meets the "Selected work" label coming up from
  // below — no overlap, and no empty band between the two. The transforms
  // live on wrapper divs because the load-in animation inside them owns
  // `transform` while it fills.
  useScrollY((y) => {
    const els = [textRef.current, cardRef.current].filter(
      (el): el is HTMLDivElement => el !== null
    );
    const backdrop = backdropRef.current;

    // Clear rather than skip: the first client frame runs before the
    // reduced-motion query resolves, and may already have written styles.
    if (reducedMotion) {
      for (const el of els) {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.pointerEvents = "";
      }
      if (backdrop) {
        backdrop.style.opacity = "";
        delete backdrop.dataset.paused;
      }
      return;
    }

    if (!metrics.current) {
      const label = document.getElementById("projects-label");
      if (els.length === 0 || !label) return;
      // Untransformed layout positions (offsetTop ignores transforms).
      const contentBottom = Math.max(
        ...els.map((el) => pageTop(el) + el.offsetHeight)
      );
      const gap = Math.max(0, pageTop(label) - contentBottom);
      const vh = window.innerHeight;
      // Content taller than the screen (phones) holds still until its bottom
      // edge has been on screen, so nothing fades before it's been read.
      const start = Math.max(0, contentBottom - vh);
      // Lag rate chosen so the label closes the gap exactly when the
      // content's bottom has risen to the exit line near the top of the
      // screen.
      const travel = Math.max(1, contentBottom - start - vh * EXIT_LINE);
      metrics.current = {
        start,
        lag: gap / (travel + gap),
        fadeDistance: travel + gap,
      };
    }

    const { start, lag, fadeDistance } = metrics.current;
    const past = Math.max(0, y - start);
    const transform = `translateY(${past * lag}px)`;
    // Ease-in: stays mostly opaque early, dropping away near the exit line.
    const progress = Math.min(1, past / fadeDistance);
    const opacity = String(1 - progress * progress);
    for (const el of els) {
      el.style.transform = transform;
      el.style.opacity = opacity;
      // Fully faded content mustn't keep catching clicks.
      el.style.pointerEvents = progress >= 1 ? "none" : "";
    }
    // Stars clear out well ahead of the content, so none show through the
    // card as it turns translucent on the way out; once gone, they pause.
    if (backdrop) {
      const starOpacity = Math.max(0, 1 - progress * 2.5);
      backdrop.style.opacity = String(starOpacity);
      backdrop.dataset.paused = String(starOpacity === 0);
    }
  });

  // Re-measure on viewport resizes and on hero size changes (font swap,
  // breakpoint reflow), and re-apply when the motion preference flips. The
  // synthetic scroll event runs the callback above on the next frame.
  useEffect(() => {
    const remeasure = () => {
      metrics.current = null;
      window.dispatchEvent(new Event("scroll"));
    };
    remeasure();
    window.addEventListener("resize", remeasure);
    const observer = new ResizeObserver(remeasure);
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      window.removeEventListener("resize", remeasure);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate overflow-x-clip"
    >
      <div ref={backdropRef} className="absolute inset-0">
        <HeroBackdrop />
      </div>
      <div className="relative mx-auto grid min-h-dvh w-full max-w-[1400px] content-center items-center gap-10 px-6 pb-10 pt-28 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-20 lg:px-12 lg:py-20">
        <div
          ref={textRef}
          // On desktop the text column top-aligns with the card, offset by the
          // card's padding so the name's cap line sits level with the photo.
          className="text-center will-change-transform lg:pt-6 lg:text-left"
        >
          <h1
            className={cn(
              // Desktop size tracks the smaller of width and height, so the
              // stacked name keeps filling the column beside the card.
              "text-[56px] font-extrabold uppercase leading-[0.88] tracking-[-0.035em] sm:text-[72px] lg:text-[min(10.5vw,17vh,168px)]",
              rise,
              "motion-safe:delay-75"
            )}
          >
            {/* Keep a real space between the lines so the heading's text
                reads "Arnav Murthi", not "ArnavMurthi". */}
            {profile.name.split(" ").map((line, i) => (
              <span key={line} className="block">
                {i > 0 && " "}
                {line}
              </span>
            ))}
          </h1>
          <p
            className={cn(
              "mx-auto mt-4 max-w-[36rem] text-balance font-copy text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground lg:mx-0 lg:mt-7 lg:max-w-[40rem] lg:text-pretty lg:text-[19px] xl:max-w-[44rem] xl:text-[22px]",
              rise,
              "motion-safe:delay-150"
            )}
          >
            Full-stack engineer and founder. Built{" "}
            <span className="text-foreground">ProfitGreen</span>, a finance app
            with{" "}
            <span className="whitespace-nowrap text-foreground">
              7,000+ users
            </span>{" "}
            that received an acquisition offer.
          </p>

          <div
            className={cn(
              "mt-[17px] flex justify-center lg:mt-[21px] lg:justify-start xl:mt-[29px]",
              rise,
              "motion-safe:delay-200"
            )}
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-1.5 font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-foreground lg:text-[14px] xl:text-[15px]"
            >
              View work
              <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </a>
          </div>
        </div>

        <div ref={cardRef} className="will-change-transform">
          <div
            className={cn(
              "flex justify-center lg:justify-end",
              rise,
              // On phones the photo is the largest paint, so it skips the
              // stagger delay.
              "motion-safe:duration-1000 lg:motion-safe:delay-300"
            )}
          >
            <HeroCard />
          </div>
        </div>
      </div>
    </section>
  );
}
