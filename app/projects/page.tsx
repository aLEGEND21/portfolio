import type { Metadata } from "next";
import Image from "next/image";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { Card } from "@/components/ui/card";
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
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg"
            >
              <Card className="h-full gap-0 overflow-hidden border-border py-0 transition-colors hover:border-faint">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                  <Image
                    src={project.image}
                    alt={`Screenshot of ${project.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top brightness-90 contrast-[0.92] grayscale-[0.85] transition-[filter] duration-[350ms] ease-out group-hover:brightness-100 group-hover:contrast-100 group-hover:grayscale-0"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-xl">
                    {project.name}
                  </h2>
                  <p className="mt-2 text-sm leading-[1.6] text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
