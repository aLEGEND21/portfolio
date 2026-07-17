"use client";

import Image from "next/image";

import { Card } from "@/components/ui/card";
import type { Project } from "@/data/projects";
import { useInView } from "@/lib/hooks/useInView";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

// Grid card for the all-projects page. Desktop colorizes on hover; touch
// devices colorize by visibility instead, matching the home page blocks: the
// media has to climb clear of the lower band of the viewport to light up.
export function ProjectCard({ project }: { project: Project }) {
  const isTouch = useMediaQuery("(hover: none)");
  const [mediaViewRef, mediaInView] = useInView<HTMLDivElement>({
    threshold: 0.6,
    rootMargin: "0% 0% -30% 0%",
  });
  const isActive = isTouch && mediaInView;

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg"
    >
      <Card className="h-full gap-0 overflow-hidden border-border py-0 transition-colors hover:border-faint">
        <div
          ref={mediaViewRef}
          className="relative aspect-[16/10] overflow-hidden border-b border-border"
        >
          <Image
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover object-top transition-[filter] duration-[800ms] ease-out",
              isActive
                ? "brightness-100 contrast-100 grayscale-0"
                : "brightness-90 contrast-[0.92] grayscale-[0.85] group-hover:brightness-100 group-hover:contrast-100 group-hover:grayscale-0"
            )}
          />
        </div>
        <div className="p-6">
          <h2 className="font-display text-xl">{project.name}</h2>
          <p className="mt-2 text-sm leading-[1.6] text-muted-foreground">
            {project.description}
          </p>
        </div>
      </Card>
    </a>
  );
}
