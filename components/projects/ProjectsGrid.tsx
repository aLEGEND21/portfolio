"use client";

import { useState } from "react";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const FILTERS = ["ALL", "WEB", "AI", "BOTS"] as const;
type Filter = (typeof FILTERS)[number];

// Filterable card grid for the all-projects page. The filter bar is plain
// mono text — no button chrome.
export function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const visible =
    filter === "ALL"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  return (
    <>
      <div className="mt-10 flex gap-6 font-mono text-[13px] font-medium uppercase tracking-[0.06em]">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "underline-offset-[6px] transition-colors duration-200",
              filter === f
                ? "text-foreground underline decoration-primary"
                : "text-faint hover:text-muted-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <div
        key={filter}
        className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((project, i) => (
          <div
            key={project.id}
            className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-200"
          >
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </>
  );
}
