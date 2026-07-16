import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { projects } from "@/data/projects";

// Compact cell in the last grid row linking to the full projects page.
export function SeeAllTile() {
  return (
    <Link
      href="/projects"
      className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden px-6 py-8 md:px-10 md:py-10"
    >
      {/* Ambient drifting glow — the only "alive" cue next to the videos. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-1/4 -inset-y-1/2 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div className="size-full rounded-full bg-[radial-gradient(closest-side,rgba(245,245,245,0.06),transparent)] motion-safe:animate-blob-drift" />
      </div>
      <p className="relative font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {projects.length} projects
      </p>
      <div className="relative flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl leading-[1.2] md:text-[28px]">
          See all projects
        </h2>
        <ArrowRight className="mb-1 size-6 shrink-0 text-muted-foreground transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </Link>
  );
}
