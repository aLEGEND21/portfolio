import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Arnav Murthi",
  description: "All projects by Arnav Murthi.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-32 lg:px-12">
        <p className="font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
          {projects.length} projects
        </p>
        <h1 className="mt-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] lg:text-6xl">
          All projects
        </h1>
        <ProjectsGrid />
      </main>
      <Footer />
    </>
  );
}
