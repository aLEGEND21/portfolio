"use client";

import { ActiveMediaProvider } from "@/components/projects/ActiveMediaContext";
import {
  ProjectBlock,
  type ProjectBlockProps,
} from "@/components/projects/ProjectBlock";
import { SeeAllTile } from "@/components/projects/SeeAllTile";
import { featuredProjects } from "@/data/projects";

function blockProps(
  slot: number,
  variant: ProjectBlockProps["variant"]
): ProjectBlockProps {
  const project = featuredProjects[slot];
  return {
    id: project.id,
    name: project.name,
    url: project.url,
    image: project.image,
    videoSrc: project.videoSrc,
    mediaCrop: project.mediaCrop,
    oneLiner: project.featured.oneLiner,
    variant,
    index: String(slot + 1).padStart(2, "0"),
  };
}

// Flush editorial grid, border-to-border on desktop: flagship row (media +
// side text), two half-width projects, then the fourth project sharing a row
// with the "all projects" cell. No gaps — hairlines separate everything. They
// are brighter than the global border token because the screenshots are dark
// and would otherwise fuse with each other and the page.
export function FeaturedProjects() {
  return (
    <section id="projects">
      <div className="mx-auto mb-6 w-full max-w-[1400px] px-6 pt-8 lg:px-12">
        <h2
          id="projects-label"
          className="text-center font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
        >
          Selected work
        </h2>
      </div>
      <ActiveMediaProvider>
        <div className="border-t border-white/15">
          {/* Row 1 — flagship */}
          <ProjectBlock {...blockProps(0, "flagship")} />

          {/* Row 2 — secondary + tertiary side by side */}
          <div className="grid divide-y divide-white/15 border-t border-white/15 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <ProjectBlock {...blockProps(1, "stacked")} />
            <ProjectBlock {...blockProps(2, "stacked")} />
          </div>

          {/* Row 3 — fourth project + all-projects link cell */}
          <div className="grid divide-y divide-white/15 border-t border-white/15 lg:grid-cols-4 lg:divide-x lg:divide-y-0 xl:grid-cols-3">
            <div className="lg:col-span-3 xl:col-span-2">
              <ProjectBlock
                {...blockProps(3, "stacked")}
                className="h-full"
                mediaClassName="lg:h-[62vh]"
              />
            </div>
            <SeeAllTile />
          </div>
        </div>
      </ActiveMediaProvider>
    </section>
  );
}
