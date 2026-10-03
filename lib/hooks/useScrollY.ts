"use client";

import { useEffect, useRef } from "react";

type ScrollCallback = (y: number) => void;

// One passive scroll listener + one rAF shared by every subscriber. Callbacks
// should write styles to refs directly — never set React state per frame.
const subscribers = new Set<ScrollCallback>();
let rafId: number | null = null;
let listening = false;

function handleScroll() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const y = window.scrollY;
    subscribers.forEach((cb) => cb(y));
  });
}

export function useScrollY(callback: ScrollCallback) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const cb: ScrollCallback = (y) => callbackRef.current(y);
    subscribers.add(cb);
    if (!listening) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      listening = true;
    }
    cb(window.scrollY);
    return () => {
      subscribers.delete(cb);
      if (subscribers.size === 0 && listening) {
        window.removeEventListener("scroll", handleScroll);
        listening = false;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, []);
}
