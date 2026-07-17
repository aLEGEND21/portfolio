"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Props = {
  image: StaticImageData;
  alt: string;
  /** Optional demo clip; plays only while active, with image as poster. */
  videoSrc?: string;
  isActive: boolean;
  sizes: string;
};

// Bare edge-to-edge media — no frame, no rounding; separation between
// projects comes from the section grid's borders.
export function ProjectMedia({ image, alt, videoSrc, isActive, sizes }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive && !reducedMotion) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, reducedMotion]);

  return (
    <div
      className={cn(
        "relative h-full w-full transition-[filter] duration-[350ms] ease-out",
        isActive
          ? "brightness-100 contrast-100 grayscale-0"
          : "brightness-90 contrast-[0.92] grayscale-[0.85]"
      )}
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={image.src}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 size-full object-cover object-center"
        />
      ) : (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-center"
        />
      )}
    </div>
  );
}
