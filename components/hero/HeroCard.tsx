"use client";

import { motion, useMotionTemplate } from "motion/react";
import Image from "next/image";

import { profile } from "@/app/id-card/profile";
import { useTilt } from "@/app/id-card/useTilt";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

// Dark-site edition of the id.arnavm.com contact card: photo over a school
// line and data rows, square-cornered like the rest of the site. The hero
// headline carries the name, so the card doesn't repeat it. The photo
// follows the projects' grayscale → color mechanic: on hover with a mouse,
// and once it's well in view on touch screens.
export function HeroCard() {
  const tilt = useTilt({ maxTilt: 6, gyro: false });
  const glare = useMotionTemplate`radial-gradient(90% 70% at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.07), transparent 70%)`;
  const interactive = tilt.canHover && !tilt.reducedMotion;
  const [photoRef, photoInView] = useInView<HTMLDivElement>({
    threshold: 0.6,
  });
  const colored = !tilt.canHover && photoInView;

  return (
    <div
      // Desktop width also yields to short viewports so the card (about 1.3x
      // as tall as wide) plus the hero's vertical padding fits in one screen.
      className="group/card w-[88%] max-w-[310px] [perspective:1200px] sm:max-w-[340px] lg:w-[min(400px,calc((100dvh-10rem)/1.3))] lg:max-w-none xl:w-[min(440px,calc((100dvh-10rem)/1.3))]"
      onMouseMove={interactive ? tilt.onMouseMove : undefined}
      onMouseLeave={interactive ? tilt.onMouseLeave : undefined}
    >
      <motion.div
        style={
          interactive
            ? { rotateX: tilt.rotateX, rotateY: tilt.rotateY }
            : undefined
        }
        className="relative flex flex-col overflow-hidden border border-white/10 bg-[linear-gradient(160deg,#16161a_0%,#0f0f11_100%)] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-6"
      >
        {interactive && (
          <motion.div
            aria-hidden
            style={{ background: glare }}
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          />
        )}

        <div className="relative text-center">
          {profile.photo && (
            <div
              ref={photoRef}
              className="relative aspect-square w-full overflow-hidden border border-white/10"
            >
              <Image
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(min-width: 1280px) 440px, (min-width: 1024px) 400px, (min-width: 640px) 340px, 88vw"
                loading="eager"
                fetchPriority="high"
                className={cn(
                  "object-cover grayscale transition-[filter] duration-700 group-hover/card:grayscale-0",
                  colored && "grayscale-0"
                )}
              />
            </div>
          )}

          <p className="mt-4 whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.04em] text-muted-foreground sm:text-[11px] sm:tracking-[0.08em]">
            {/* Phones too narrow for one line drop the separator and stack. */}
            {profile.university.split(" · ").map((part, i) => (
              <span key={part}>
                {i > 0 && (
                  <span className="hidden min-[380px]:inline">{" · "}</span>
                )}
                <span className="block min-[380px]:inline">{part}</span>
              </span>
            ))}
          </p>

          <dl className="mt-4 flex justify-center gap-8 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.06em] sm:gap-10 sm:text-[11px] sm:tracking-[0.08em]">
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="mt-0.5 text-foreground/90">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Class</dt>
              <dd className="mt-0.5 text-foreground/90">{profile.classYear}</dd>
            </div>
          </dl>
        </div>
      </motion.div>
    </div>
  );
}
