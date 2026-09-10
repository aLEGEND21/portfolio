"use client";

import { useRef } from "react";

import { ActiveMediaProvider } from "@/components/projects/ActiveMediaContext";
import {
  ProjectBlock,
  type ProjectBlockProps,
} from "@/components/projects/ProjectBlock";
import { SeeAllTile } from "@/components/projects/SeeAllTile";
import { featuredProjects } from "@/data/projects";
import {
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/hooks/useMediaQuery";
import { useScrollY } from "@/lib/hooks/useScrollY";

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
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = usePrefersReducedMotion();

  // On mobile the section catches up to the departing hero: it rises slightly
  // faster than the scroll until it reaches the top of the frame, where the
  // offset decays to zero and scrolling feels normal again.
  useScrollY((y) => {
    const el = sectionRef.current;
    if (!el) return;
    if (isDesktop || reducedMotion) {
      el.style.transform = "";
      return;
    }
    // +64 = the section's mobile pt-16, so the boost lasts until the
    // "Project Highlights" header itself reaches the top of the frame.
    const headerTop = el.offsetTop + 64;
    const progress = Math.min(
      1,
      Math.max(0, (headerTop - y) / window.innerHeight)
    );
    el.style.transform =
      progress > 0 ? `translateY(${-0.35 * y * progress}px)` : "";
  });

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="scroll-mt-0 pt-16 will-change-transform lg:scroll-mt-16 lg:pt-32"
    >
      <div className="mx-auto mb-10 w-full max-w-[1400px] px-6 lg:mb-14 lg:px-12">
        <h2 className="text-center font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Project Highlights
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
