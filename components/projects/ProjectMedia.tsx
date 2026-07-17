"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive && !reducedMotion) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, reducedMotion]);

  // A video's poster fires no load event, so preload it as a plain image to
  // know when the skeleton can go.
  useEffect(() => {
    if (!videoSrc) return;
    const poster = new window.Image();
    poster.onload = () => setLoaded(true);
    poster.src = image.src;
    return () => {
      poster.onload = null;
    };
  }, [videoSrc, image.src]);

  const mediaClassName = cn(
    "absolute inset-0 size-full object-cover object-center transition-opacity duration-500",
    loaded ? "opacity-100" : "opacity-0"
  );

  return (
    <div
      // Absolute + inset instead of h-full/w-full: iOS Safari resolves a
      // percentage height against the parent's aspect-ratio-derived height as
      // indefinite, letting the video blow up to its intrinsic size.
      // overflow-hidden guarantees nothing escapes the media cell regardless.
      className={cn(
        "absolute inset-0 overflow-hidden transition-[filter] duration-[800ms] ease-out",
        isActive
          ? "brightness-100 contrast-100 grayscale-0"
          : "brightness-90 contrast-[0.92] grayscale-[0.85]"
      )}
    >
      {!loaded && <Skeleton className="absolute inset-0" />}
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={image.src}
          muted
          loop
          playsInline
          preload="metadata"
          className={mediaClassName}
        />
      ) : (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          className={mediaClassName}
        />
      )}
    </div>
  );
}
