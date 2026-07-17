"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const CARY_NC: [number, number] = [35.79, -78.78];

// cobe's coordinate mapping for pointing a [lat, lon] at the camera.
function locationToAngles(lat: number, lon: number): [number, number] {
  return [
    Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
}

const SPIN_SPEED = 0.002;
// Sphere radius as a fraction of the canvas half-size, matching cobe's render.
const SPHERE_RADIUS_RATIO = 0.8;

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement!;

    const [targetPhi, targetTheta] = locationToAngles(...CARY_NC);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = container.offsetWidth || 400;
    const onResize = () => {
      size = container.offsetWidth || size;
    };
    window.addEventListener("resize", onResize);

    let phi = targetPhi;
    const theta = reducedMotion ? targetTheta : 0.25;
    const scale = 1.15;

    // Cary's unit vector on the un-rotated sphere; rotating it by the current
    // phi/theta gives its camera-space position for the pin overlay.
    const latR = (CARY_NC[0] * Math.PI) / 180;
    const base = {
      x: -Math.cos(latR) * Math.sin(targetPhi),
      y: Math.sin(latR),
      z: Math.cos(latR) * Math.cos(targetPhi),
    };

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi,
      theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 5,
      baseColor: [0.35, 0.35, 0.38],
      markerColor: [0.23, 0.51, 0.96],
      glowColor: [0.07, 0.07, 0.08],
      scale,
      markers: [],
    });

    // cobe v2 renders on update(); drive it with our own rAF loop.
    let rafId = 0;
    const frame = () => {
      if (!reducedMotion) {
        phi += SPIN_SPEED;
      }
      globe.update({
        phi,
        theta,
        scale,
        width: size * dpr,
        height: size * dpr,
      });

      // Keep the pin overlay glued to Cary; hide it near/behind the limb.
      const pin = pinRef.current;
      if (pin) {
        const x1 = base.x * Math.cos(phi) + base.z * Math.sin(phi);
        const z1 = -base.x * Math.sin(phi) + base.z * Math.cos(phi);
        const y2 = base.y * Math.cos(theta) - z1 * Math.sin(theta);
        const z2 = base.y * Math.sin(theta) + z1 * Math.cos(theta);
        const r = (size / 2) * scale * SPHERE_RADIUS_RATIO;
        const px = size / 2 + x1 * r;
        const py = size / 2 - y2 * r;
        pin.style.transform = `translate(${px}px, ${py}px) translate(-50%, -100%)`;
        // Fade out continuously as Cary approaches the limb of the globe.
        pin.style.opacity = String(Math.min(1, Math.max(0, (z2 - 0.08) / 0.3)));
      }

      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    canvas.style.opacity = "1";

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden
      className={cn(
        "relative aspect-square w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
      />
      <div
        ref={pinRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 will-change-transform"
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="#2563eb"
          stroke="#0a0a0b"
          strokeWidth="1"
        >
          <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 6 8 12 8 12s8-6 8-12Z" />
          <circle cx="12" cy="10" r="3" fill="#0a0a0b" stroke="none" />
        </svg>
      </div>
    </div>
  );
}
