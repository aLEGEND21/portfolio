import Image from "next/image";

import { profile } from "../profile";
import { SocialLinks } from "./SocialLinks";

// Portrait ID-card shell (driver's-license grammar: eyebrow zone, photo
// block, name, issuer line, data rows). All internal sizing is in cqw so the
// card keeps identical proportions from phone-width up to the desktop cap.
// Width is triple-capped so it fills a phone screen but stays a fixed
// card-sized object (never taller than the viewport) on desktop.
export function IDCard() {
  const nameLines = profile.name.split(" ");
  const initials = nameLines.map((w) => w[0]).join("");

  return (
    <div className="w-[min(92vw,var(--card-size-cap,55dvh),380px)] transition-[width] duration-300 [container-type:inline-size]">
      <article
        className="relative flex aspect-[1/1.58] w-full flex-col rounded-[var(--card-radius)] p-[7cqw] text-[var(--ink)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)]"
        style={{
          background:
            "radial-gradient(135% 115% at 16% 6%, var(--frost) 0%, var(--sky) 48%, var(--cobalt) 100%)",
        }}
      >
        {/* Static off-center bloom — the tilt-reactive glare layers on top. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[var(--card-radius)] opacity-50 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(60% 45% at 70% 18%, var(--highlight) 0%, transparent 70%)",
          }}
        />

        <header className="flex items-baseline justify-between font-mono text-[3.4cqw] font-medium uppercase tracking-[0.18em] text-[var(--ink)]/85">
          <span>Contact Card</span>
          <span>N&ordm; {profile.issued}</span>
        </header>

        <div className="my-[4.5cqw] h-px bg-[var(--ink-15)]" />

        <div className="flex items-start justify-between gap-[4cqw]">
          <div className="relative flex aspect-square w-[26cqw] items-center justify-center overflow-hidden rounded-[10px] border border-[var(--ink-15)] bg-[var(--highlight)]/40">
            {profile.photo ? (
              <Image
                src={profile.photo}
                alt={profile.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            ) : (
              <span className="font-[family-name:var(--font-archivo-black)] text-[10cqw] tracking-tight">
                {initials}
              </span>
            )}
          </div>
          {/* Pinned to the monogram block's height so the two columns read
              as one aligned row. */}
          <dl className="flex h-[26cqw] flex-col justify-between text-right font-mono text-[3.6cqw] uppercase tracking-[0.12em]">
            <div>
              <dt className="text-[var(--ink)]/60">Location</dt>
              <dd className="text-[var(--ink)]/90">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/60">Class</dt>
              <dd className="text-[var(--ink)]/90">{profile.classYear}</dd>
            </div>
          </dl>
        </div>

        {/* mt-auto here and on the links block below splits the card's spare
            vertical space evenly between the two, instead of it all pooling
            into one band after the bio. */}
        <h1 className="mt-auto pt-[3cqw] font-[family-name:var(--font-archivo-black)] text-[13cqw] uppercase leading-[0.98] tracking-tight">
          {nameLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-[2.5cqw] font-mono text-[3.6cqw] font-medium uppercase tracking-[0.06em] text-[var(--ink)]/90">
          {profile.university}
        </p>

        <p className="mt-[4cqw] font-mono text-[3.8cqw] leading-[1.55] text-[var(--ink)]/90">
          {profile.bio}
        </p>

        <div className="mt-auto">
          <div className="mb-[4.5cqw] h-px bg-[var(--ink-15)]" />
          <SocialLinks />
        </div>
      </article>
    </div>
  );
}
