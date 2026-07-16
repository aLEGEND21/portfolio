"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type ActiveMedia = {
  activeId: string | null;
  setActiveId: Dispatch<SetStateAction<string | null>>;
};

// At most one project block is in color / playing at a time (last-in wins).
const ActiveMediaContext = createContext<ActiveMedia | null>(null);

export function ActiveMediaProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <ActiveMediaContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ActiveMediaContext.Provider>
  );
}

export function useActiveMedia() {
  const ctx = useContext(ActiveMediaContext);
  if (!ctx) {
    throw new Error("useActiveMedia must be used within ActiveMediaProvider");
  }
  return ctx;
}
