"use client";

import { geoEquirectangular, geoPath } from "d3-geo";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import landTopo from "world-atlas/land-110m.json";

import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const CHAPEL_HILL_NC: [number, number] = [35.91, -79.06]; // [lat, lon]

const SPIN_DEG_PER_SEC = 7;
// Sphere radius as a fraction of the canvas size, matching the old render.
const RADIUS_RATIO = 0.46;
// Camera tilt toward the northern hemisphere while spinning.
const TILT_DEG = 16;
// Total points scattered over the sphere before masking to land (~29% keep).
const SPHERE_SAMPLES = 20000;
const DOT_RADIUS_RATIO = 0.0032;

const topology = landTopo as unknown as Topology;
const land = feature(topology, topology.objects.land);

// Land dots as per-dot [sinLat, cosLat, sinLon, cosLon], so the per-frame
// rotation is pure multiplies. Built once per session from a rasterized
// equirectangular land mask — sampling real polygons is what guarantees no
// region gets skipped, unlike cobe's baked-in dot texture.
let dotTable: Float32Array | null = null;

function buildDotTable(): Float32Array | null {
  if (dotTable) return dotTable;
  const W = 2048;
  const H = 1024;
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const mctx = mask.getContext("2d", { willReadFrequently: true });
  if (!mctx) return null;
  const projection = geoEquirectangular()
    .scale(W / (2 * Math.PI))
    .translate([W / 2, H / 2]);
  mctx.fillStyle = "#fff";
  mctx.beginPath();
  geoPath(projection, mctx)(land);
  mctx.fill();
  const pixels = mctx.getImageData(0, 0, W, H).data;

  const golden = Math.PI * (3 - Math.sqrt(5));
  const kept: number[] = [];
  for (let i = 0; i < SPHERE_SAMPLES; i++) {
    const sinLat = 1 - (2 * (i + 0.5)) / SPHERE_SAMPLES;
    const cosLat = Math.sqrt(1 - sinLat * sinLat);
    const lonR = ((i * golden) % (2 * Math.PI)) - Math.PI;
    const px = Math.round(((lonR + Math.PI) / (2 * Math.PI)) * (W - 1));
    const py = Math.round(((1 - (Math.asin(sinLat) / Math.PI + 0.5)) * (H - 1)));
    if (pixels[(py * W + px) * 4 + 3] > 0) {
      kept.push(sinLat, cosLat, Math.sin(lonR), Math.cos(lonR));
    }
  }
  dotTable = new Float32Array(kept);
  return dotTable;
}

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const container = canvas.parentElement!;
    const dots = buildDotTable();
    if (!dots) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = container.offsetWidth || 400;
    const applySize = () => {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    };
    applySize();
    const onResize = () => {
      const next = container.offsetWidth;
      if (next && next !== size) {
        size = next;
        applySize();
        if (reducedMotion) draw();
      }
    };
    window.addEventListener("resize", onResize);

    const rad = Math.PI / 180;
    const [pinLat, pinLon] = CHAPEL_HILL_NC;
    // View-center longitude starts on Chapel Hill and drifts west; the tilt
    // aims straight at the pin when motion is reduced.
    let centerLon = pinLon * rad;
    const tilt = (reducedMotion ? pinLat : TILT_DEG) * rad;
    const sinT = Math.sin(tilt);
    const cosT = Math.cos(tilt);

    // Alpha buckets so dots are lit by viewing angle without thousands of
    // per-dot canvas state changes.
    const BUCKETS = 10;
    const paths: Path2D[] = [];

    const draw = () => {
      const r = size * RADIUS_RATIO;
      const c = size / 2;
      const dotR = size * DOT_RADIUS_RATIO;
      const sinL = Math.sin(centerLon);
      const cosL = Math.cos(centerLon);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const shade = ctx.createRadialGradient(c, c, r * 0.15, c, c, r);
      shade.addColorStop(0, "#17171b");
      shade.addColorStop(1, "#0c0c0e");
      ctx.beginPath();
      ctx.arc(c, c, r, 0, 2 * Math.PI);
      ctx.fillStyle = shade;
      ctx.fill();

      for (let b = 0; b < BUCKETS; b++) paths[b] = new Path2D();
      for (let i = 0; i < dots.length; i += 4) {
        const sinLat = dots[i];
        const cosLat = dots[i + 1];
        // sin/cos of (lon - centerLon), expanded from the per-dot table.
        const sinD = dots[i + 2] * cosL - dots[i + 3] * sinL;
        const cosD = dots[i + 3] * cosL + dots[i + 2] * sinL;
        const x1 = cosLat * sinD;
        const y1 = sinLat;
        const z1 = cosLat * cosD;
        const y2 = y1 * cosT - z1 * sinT;
        const z2 = y1 * sinT + z1 * cosT;
        if (z2 <= 0) continue;
        const bucket = Math.min(BUCKETS - 1, Math.floor(z2 * BUCKETS));
        const px = c + x1 * r;
        const py = c - y2 * r;
        paths[bucket].moveTo(px + dotR, py);
        paths[bucket].arc(px, py, dotR, 0, 2 * Math.PI);
      }
      for (let b = 0; b < BUCKETS; b++) {
        const light = (b + 0.5) / BUCKETS;
        ctx.fillStyle = `rgba(228, 233, 242, ${0.12 + 0.68 * light})`;
        ctx.fill(paths[b]);
      }

      ctx.beginPath();
      ctx.arc(c, c, r, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Keep the pin overlay glued to Chapel Hill; fade it out continuously
      // as it approaches the limb.
      const pin = pinRef.current;
      if (pin) {
        const sinD = Math.sin(pinLon * rad - centerLon);
        const cosD = Math.cos(pinLon * rad - centerLon);
        const x1 = Math.cos(pinLat * rad) * sinD;
        const y1 = Math.sin(pinLat * rad);
        const z1 = Math.cos(pinLat * rad) * cosD;
        const y2 = y1 * cosT - z1 * sinT;
        const z2 = y1 * sinT + z1 * cosT;
        const px = c + x1 * r;
        const py = c - y2 * r;
        pin.style.transform = `translate(${px}px, ${py}px) translate(-50%, -100%)`;
        pin.style.opacity = String(Math.min(1, Math.max(0, (z2 - 0.08) / 0.3)));
      }
    };

    let rafId = 0;
    let last = performance.now();
    const frame = (now: number) => {
      centerLon -= SPIN_DEG_PER_SEC * rad * ((now - last) / 1000);
      last = now;
      draw();
      rafId = requestAnimationFrame(frame);
    };
    if (reducedMotion) {
      draw();
    } else {
      rafId = requestAnimationFrame(frame);
    }

    canvas.style.opacity = "1";

    return () => {
      cancelAnimationFrame(rafId);
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
        <svg width="34" height="34" viewBox="0 0 24 24" fill="url(#globe-pin-gradient)">
          <defs>
            {/* primary ↔ accent-hover, matching the hero typewriter gradient;
                the stops crossfade in opposite phase so the fill pulses. */}
            <linearGradient id="globe-pin-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb">
                <animate
                  attributeName="stop-color"
                  values="#2563eb;#60a5fa;#2563eb"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#60a5fa">
                <animate
                  attributeName="stop-color"
                  values="#60a5fa;#2563eb;#60a5fa"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
          <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 6 8 12 8 12s8-6 8-12Z" />
          <circle cx="12" cy="10" r="3" fill="#0a0a0b" stroke="none" />
        </svg>
      </div>
    </div>
  );
}
