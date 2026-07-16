import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { Navbar } from "@/components/nav/Navbar";
import { FeaturedProjects } from "@/components/projects/FeaturedProjects";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <main>
        <FeaturedProjects />
      </main>
      <Footer />
    </>
  );
}
