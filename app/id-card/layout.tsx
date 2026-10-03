import type { Metadata } from "next";
import { Archivo_Black } from "next/font/google";

import "./idcard.css";

import { profile } from "./profile";

// Bold condensed grotesk for the name block — matches the ticket's
// "ARNAV MURTHI" treatment. Only loaded on this route.
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arnav Murthi — Contact Card",
  description: profile.bio,
  openGraph: {
    title: "Arnav Murthi — Contact Card",
    description: profile.bio,
    url: "https://id.arnavm.com",
    siteName: "Arnav Murthi",
    type: "website",
    // No `images` here — the colocated opengraph-image.tsx registers itself.
  },
  // Unlike the portfolio's compact `summary` card, the card page's OG render
  // is a designed landscape image, so let embeds show it full-width.
  twitter: { card: "summary_large_image" },
};

// Full-viewport dark stage with the card centered; deliberately no portfolio
// nav/footer.
export default function IDCardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${archivoBlack.variable} idcard-stage grid min-h-dvh flex-1 place-items-center overflow-x-clip bg-[var(--ink)] px-4 py-8`}
    >
      {children}
    </div>
  );
}
