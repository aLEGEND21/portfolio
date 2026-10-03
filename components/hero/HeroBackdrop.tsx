import type { CSSProperties } from "react";

/**
 * Slow, faint shooting stars drifting from the lower right toward the upper
 * left. Each has its own heading (a few degrees either side of 25° above
 * horizontal), length, brightness and cycle, so they never read as a
 * uniform sheet of rain. Negative delays put them mid-flight on load.
 */
const STARS = [
  {
    x: 96,
    y: 86,
    angle: 205,
    length: 120,
    duration: 15,
    delay: -2,
    opacity: 0.26,
  },
  {
    x: 74,
    y: 102,
    angle: 201,
    length: 70,
    duration: 19,
    delay: -9,
    opacity: 0.14,
  },
  {
    x: 108,
    y: 58,
    angle: 208,
    length: 150,
    duration: 17,
    delay: -5,
    opacity: 0.22,
  },
  {
    x: 88,
    y: 112,
    angle: 203,
    length: 90,
    duration: 22,
    delay: -15,
    opacity: 0.18,
  },
  {
    x: 102,
    y: 40,
    angle: 209,
    length: 60,
    duration: 14,
    delay: -11,
    opacity: 0.12,
  },
  {
    x: 82,
    y: 76,
    angle: 204,
    length: 100,
    duration: 20,
    delay: -17,
    opacity: 0.2,
  },
  {
    x: 112,
    y: 92,
    angle: 202,
    length: 130,
    duration: 18,
    delay: -7,
    opacity: 0.24,
  },
  {
    x: 92,
    y: 64,
    angle: 207,
    length: 50,
    duration: 16,
    delay: -13,
    opacity: 0.1,
  },
  {
    x: 104,
    y: 74,
    angle: 206,
    length: 80,
    duration: 21,
    delay: -3.5,
    opacity: 0.16,
  },
  {
    x: 78,
    y: 92,
    angle: 200,
    length: 110,
    duration: 16.5,
    delay: -19,
    opacity: 0.2,
  },
  {
    x: 98,
    y: 104,
    angle: 205,
    length: 60,
    duration: 23,
    delay: -10,
    opacity: 0.12,
  },
  {
    x: 100,
    y: 68,
    angle: 204,
    length: 90,
    duration: 18,
    delay: -6.5,
    opacity: 0.18,
  },
  {
    x: 78,
    y: 108,
    angle: 206,
    length: 110,
    duration: 16,
    delay: -12,
    opacity: 0.22,
  },
  {
    x: 90,
    y: 98,
    angle: 208,
    length: 140,
    duration: 15.5,
    delay: -8.5,
    opacity: 0.24,
  },
  {
    x: 106,
    y: 82,
    angle: 207,
    length: 100,
    duration: 17.5,
    delay: -3.5,
    opacity: 0.2,
  },
  {
    x: 94,
    y: 50,
    angle: 206,
    length: 110,
    duration: 22,
    delay: -4.5,
    opacity: 0.2,
  },
];

export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      // Masked away from the copy, so a star never crosses the text and
      // reads as a strikethrough: on desktop they stay right of the text
      // column; on phones, in the lower band around the card.
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_50%,black_70%)] motion-reduce:hidden lg:[mask-image:linear-gradient(to_right,transparent_50%,black_64%)]"
    >
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            transform: `rotate(${star.angle}deg)`,
            transformOrigin: "0 0",
          }}
        >
          <span
            className="block h-px animate-star-drift [[data-paused=true]_&]:[animation-play-state:paused] bg-gradient-to-r from-transparent to-white opacity-0"
            style={
              {
                width: star.length,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
                "--star-opacity": star.opacity,
                "--star-distance": "80vmax",
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}
