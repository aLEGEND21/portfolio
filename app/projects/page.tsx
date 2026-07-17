import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Arnav Murthi",
  description: "All projects by Arnav Murthi.",
};

// Stub listing page — the full projects page design comes later.
export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-32 md:px-12">
        <p className="font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
          {projects.length} projects
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.15] md:text-5xl">
          All projects
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
