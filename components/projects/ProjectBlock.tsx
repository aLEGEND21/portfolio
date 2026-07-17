"use client";

import { type StaticImageData } from "next/image";
import { useEffect } from "react";

import { useActiveMedia } from "@/components/projects/ActiveMediaContext";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { useInView } from "@/lib/hooks/useInView";
import {
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export type ProjectBlockProps = {
  id: string;
  name: string;
  url: string;
  image: StaticImageData;
  videoSrc?: string;
  oneLiner: string;
  /**
   * flagship — full-width row, media beside a text panel.
   * stacked — media on top, text panel below (half/two-thirds cells).
   */
  variant: "flagship" | "stacked";
  /** Large low-opacity mono anchor, e.g. "01". */
  index: string;
  className?: string;
  /** Extra classes for the media area, e.g. to override its height. */
  mediaClassName?: string;
};

export function ProjectBlock({
  id,
  name,
  url,
  image,
  videoSrc,
  oneLiner,
  variant,
  index,
  className,
  mediaClassName,
}: ProjectBlockProps) {
  const { activeId, setActiveId } = useActiveMedia();
  const isActive = activeId === id;
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useMediaQuery("(hover: none)");

  const [revealRef, revealed] = useInView<HTMLAnchorElement>({
    threshold: 0.15,
    once: true,
  });
  // The bottom margin keeps touch activation (color + playback) from firing
  // while the media is still entering at the bottom edge; it has to climb
  // clear of the lower band of the viewport before it lights up.
  const [mediaViewRef, mediaInView] = useInView<HTMLDivElement>({
    threshold: 0.6,
    rootMargin: "0% 0% -30% 0%",
  });

  // Touch devices activate by visibility instead of hover.
  useEffect(() => {
    if (!isTouch) return;
    if (mediaInView) {
      setActiveId(id);
    } else {
      setActiveId((current) => (current === id ? null : current));
    }
  }, [isTouch, mediaInView, id, setActiveId]);

  const deactivate = () =>
    setActiveId((current) => (current === id ? null : current));

  const shown = revealed || reducedMotion;

  const text = (
    <div>
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        <span aria-hidden className="mr-2 text-faint">
          {index}
        </span>
        {name}
      </p>
      <h3 className="mt-4 max-w-[420px] font-display text-[26px] leading-[1.2] md:text-[32px]">
        {oneLiner}
      </h3>
    </div>
  );

  return (
    <a
      ref={revealRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => !isTouch && setActiveId(id)}
      onMouseLeave={() => !isTouch && deactivate()}
      onFocus={() => setActiveId(id)}
      onBlur={deactivate}
      className={cn(
        "group block transition-opacity duration-500 ease-out",
        shown ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {variant === "flagship" ? (
        <div className="grid md:grid-cols-3">
          <div
            ref={mediaViewRef}
            className="relative aspect-video md:col-span-2 md:aspect-auto md:h-[70vh]"
          >
            <ProjectMedia
              image={image}
              alt={`Screenshot of ${name}`}
              videoSrc={videoSrc}
              isActive={isActive}
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>
          <div className="flex items-center border-t border-border px-6 py-10 transition-colors duration-300 group-hover:bg-white/[0.02] md:border-l md:border-t-0 md:px-12">
            {text}
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div
            ref={mediaViewRef}
            className={cn(
              "relative aspect-video flex-none md:aspect-auto md:h-[48vh]",
              mediaClassName
            )}
          >
            <ProjectMedia
              image={image}
              alt={`Screenshot of ${name}`}
              videoSrc={videoSrc}
              isActive={isActive}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex-1 border-t border-border px-6 py-8 transition-colors duration-300 group-hover:bg-white/[0.02] md:px-10 md:py-10">
            {text}
          </div>
        </div>
      )}
    </a>
  );
}
