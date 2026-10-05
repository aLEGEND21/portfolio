"use client";

import { useSyncExternalStore } from "react";

import { formatIssued } from "../profile";

const emptySubscribe = () => () => {};

// The page is prerendered, so the date has to be read on the client to track
// the viewer's actual "today". `fallback` is the server-rendered (build) date —
// it must come in as a prop so hydration sees the exact same value.
export function IssuedDate({ fallback }: { fallback: string }) {
  return useSyncExternalStore(
    emptySubscribe,
    () => formatIssued(new Date()),
    () => fallback
  );
}
