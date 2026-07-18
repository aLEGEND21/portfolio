"use client";

import { motion } from "motion/react";

import { useTilt } from "../useTilt";
import { GlareOverlay } from "./GlareOverlay";
import { TiltPermissionPrompt } from "./TiltPermissionPrompt";

// Owns all the tilt interactivity; the card itself stays a server-rendered
// child. With prefers-reduced-motion the card renders static — no tilt, no
// moving glare.
export function TiltWrapper({ children }: { children: React.ReactNode }) {
  const tilt = useTilt();

  if (tilt.reducedMotion) {
    return <div className="relative">{children}</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        style={{ perspective: 1200 }}
        onMouseMove={tilt.canHover ? tilt.onMouseMove : undefined}
        onMouseLeave={tilt.canHover ? tilt.onMouseLeave : undefined}
      >
        <motion.div
          style={{
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative"
        >
          {children}
          <GlareOverlay glareX={tilt.glareX} glareY={tilt.glareY} />
        </motion.div>
      </div>
      {tilt.needsGyroPermission && (
        <TiltPermissionPrompt onEnable={tilt.requestGyroPermission} />
      )}
    </div>
  );
}
