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
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center border border-foreground bg-primary font-display text-[13px] text-primary-foreground">
              AM
            </span>
            <span className="font-display text-lg">Arnav Murthi</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
