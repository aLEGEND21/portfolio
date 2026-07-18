"use client";

import Image from "next/image";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/data/projects";
import { useInView } from "@/lib/hooks/useInView";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

// Grid card for the all-projects page. Desktop colorizes on hover; touch
// devices colorize by visibility instead, matching the home page blocks: the
// media has to climb clear of the lower band of the viewport to light up.
// `index` is the card's position in the currently visible (filtered) grid.
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const isTouch = useMediaQuery("(hover: none)");
  const [mediaViewRef, mediaInView] = useInView<HTMLDivElement>({
    threshold: 0.6,
    rootMargin: "0% 0% -30% 0%",
  });
  const isActive = isTouch && mediaInView;
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full rounded-lg"
    >
      <Card
        className={cn(
          "h-full gap-0 overflow-hidden border-border py-0 transition-colors duration-300 hover:border-primary/60",
          isActive && "border-primary/60"
        )}
      >
        <div
          ref={mediaViewRef}
          className="relative aspect-[16/10] overflow-hidden border-b border-border"
        >
          {!loaded && <Skeleton className="absolute inset-0" />}
          <Image
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={() => setLoaded(true)}
            className={cn(
              "object-cover object-top transition-[filter,opacity,scale] duration-[800ms] ease-out group-hover:scale-[1.02]",
              loaded ? "opacity-100" : "opacity-0",
              isActive
                ? "brightness-100 contrast-100 grayscale-0"
                : "brightness-90 contrast-[0.92] grayscale-[0.85] group-hover:brightness-100 group-hover:contrast-100 group-hover:grayscale-0"
            )}
          />
        </div>
        <div className="p-6">
          <div className="transition-transform duration-300 ease-out group-hover:-translate-y-[3px]">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl">{project.name}</h2>
              <span
                aria-hidden
                className={cn(
                  "font-mono text-[13px] font-medium leading-none text-faint/60 transition-colors duration-300 group-hover:text-faint",
                  isActive && "text-faint"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
              {project.tags.join(", ")}
            </p>
            <p className="mt-2.5 text-sm leading-[1.6] text-muted-foreground transition-colors duration-300 group-hover:text-foreground/75">
              {project.description}
            </p>
          </div>
        </div>
      </Card>
    </a>
  );
}
