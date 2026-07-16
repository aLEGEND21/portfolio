"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";

const ROLES = ["full-stack developer", "founder", "freelancer", "student"];

const TYPE_MS = 70;
const DELETE_MS = 40;
const HOLD_MS = 1800;

export function Typewriter() {
  const reducedMotion = usePrefersReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [length, setLength] = useState(ROLES[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const role = ROLES[roleIndex];
    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && length === role.length) delay = HOLD_MS;

    const timeout = setTimeout(() => {
      if (deleting) {
        if (length === 0) {
          setDeleting(false);
          setRoleIndex((i) => (i + 1) % ROLES.length);
        } else {
          setLength((l) => l - 1);
        }
      } else {
        if (length === role.length) {
          setDeleting(true);
        } else {
          setLength((l) => l + 1);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [reducedMotion, roleIndex, length, deleting]);

  const visible = reducedMotion ? ROLES[0] : ROLES[roleIndex].slice(0, length);

  return (
    <>
      <span aria-hidden className="whitespace-nowrap">
        <span className="mr-3 select-none text-faint">&gt;</span>
        <span className="bg-gradient-to-r from-primary to-accent-hover bg-clip-text font-medium text-transparent">
          {visible}
        </span>
        <span
          className={
            "ml-1 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-primary " +
            (reducedMotion ? "" : "animate-cursor-blink")
          }
        />
      </span>
      <span className="sr-only">
        Full-stack developer, founder, freelancer, and student.
      </span>
    </>
  );
}
