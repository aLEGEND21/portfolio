"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useSpring, useTransform } from "motion/react";

import {
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/hooks/useMediaQuery";

const DEFAULT_MAX_TILT = 13; // degrees
const SPRING = { stiffness: 150, damping: 15 };
// Degrees of physical device tilt (from the neutral holding angle) that map
// to the full card tilt range.
const GYRO_RANGE = 18;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

type RequestPermissionFn = () => Promise<"granted" | "denied">;

type GyroSupport = "unsupported" | "needs-permission" | "ready";

// Static capability of the browser — computed once on the client. iOS 13+
// gates orientation events behind a user-gesture permission request
// ("needs-permission"); Android and older browsers just emit events ("ready").
let gyroSupport: GyroSupport | null = null;
function getGyroSupport(): GyroSupport {
  if (gyroSupport === null) {
    if (typeof window.DeviceOrientationEvent === "undefined") {
      gyroSupport = "unsupported";
    } else {
      const hasPermissionGate =
        typeof (
          DeviceOrientationEvent as unknown as {
            requestPermission?: RequestPermissionFn;
          }
        ).requestPermission === "function";
      gyroSupport = hasPermissionGate ? "needs-permission" : "ready";
    }
  }
  return gyroSupport;
}
const emptySubscribe = () => () => {};

// Cursor position (desktop) or device orientation (mobile) → spring-smoothed
// rotation + glare-center motion values. Glare slides opposite the tilt,
// holographic-card style.
// `gyro: false` keeps a card mouse-only — for embeds in a scrolling page,
// where tilting the phone to read shouldn't also swing the card.
export function useTilt({
  maxTilt = DEFAULT_MAX_TILT,
  gyro = true,
}: { maxTilt?: number; gyro?: boolean } = {}) {
  const reducedMotion = usePrefersReducedMotion();
  const canHover = useMediaQuery("(hover: hover)");

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const glareX = useTransform(rotateY, (v) => 50 - (v / maxTilt) * 40);
  const glareY = useTransform(rotateX, (v) => 50 + (v / maxTilt) * 40);

  // Offsets are -0.5..0.5 from card center on each axis.
  const setOffsets = useCallback(
    (ox: number, oy: number) => {
      rotateX.set(oy * -maxTilt);
      rotateY.set(ox * maxTilt);
    },
    [rotateX, rotateY, maxTilt]
  );

  const reset = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setOffsets(
        (e.clientX - rect.left) / rect.width - 0.5,
        (e.clientY - rect.top) / rect.height - 0.5
      );
    },
    [setOffsets]
  );

  const support = useSyncExternalStore(
    emptySubscribe,
    getGyroSupport,
    () => "unsupported" as const
  );
  const [permission, setPermission] = useState<"idle" | "granted" | "denied">(
    "idle"
  );

  const gyroEnabled =
    gyro &&
    !canHover &&
    !reducedMotion &&
    (support === "ready" ||
      (support === "needs-permission" && permission === "granted"));
  const needsGyroPermission =
    gyro &&
    !canHover &&
    !reducedMotion &&
    support === "needs-permission" &&
    permission === "idle";

  // Must be called from a user gesture (tap) on iOS.
  const requestGyroPermission = useCallback(async () => {
    try {
      const result = await (
        DeviceOrientationEvent as unknown as {
          requestPermission: RequestPermissionFn;
        }
      ).requestPermission();
      setPermission(result === "granted" ? "granted" : "denied");
    } catch {
      setPermission("denied");
    }
  }, []);

  useEffect(() => {
    if (!gyroEnabled) return;
    // The first reading becomes the neutral holding angle so the card sits
    // flat however the phone is initially held.
    let base: { beta: number; gamma: number } | null = null;
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      base ??= { beta: e.beta, gamma: e.gamma };
      setOffsets(
        clamp(e.gamma - base.gamma, -GYRO_RANGE, GYRO_RANGE) / (GYRO_RANGE * 2),
        clamp(e.beta - base.beta, -GYRO_RANGE, GYRO_RANGE) / (GYRO_RANGE * 2)
      );
    };
    window.addEventListener("deviceorientation", onOrientation);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      reset();
    };
  }, [gyroEnabled, setOffsets, reset]);

  return {
    reducedMotion,
    canHover,
    rotateX,
    rotateY,
    glareX,
    glareY,
    onMouseMove,
    onMouseLeave: reset,
    needsGyroPermission,
    requestGyroPermission,
  };
}
