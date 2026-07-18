"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useScrollY } from "@/lib/hooks/useScrollY";
import { cn } from "@/lib/utils";

const NAV_HEIGHT = 64;

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const lastY = useRef(0);

  useScrollY((y) => {
    const diff = y - lastY.current;
    if (Math.abs(diff) >= 8) {
      // Never hide near the very top of the page.
      setHidden(diff > 0 && y > NAV_HEIGHT + 16);
      lastY.current = y;
    }
  });

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px` }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "transition-colors duration-300",
          pastHero
            ? "border-b border-border bg-card/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <Link
            href="/"
            className="group relative font-mono text-[13px] font-medium uppercase tracking-[0.06em]"
          >
            Arnav Murthi
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
          </Link>
          <Link
            href="/projects"
            className="group relative font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Projects
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}
