import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Labels, nav, and metadata: a typographic mono rather than a code font.
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Running copy (the hero bio).
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

// Absolute URLs (og:image thumbnail, og:url) resolve against this — switch
// to https://arnavm.com when the site moves off the new. subdomain.
const SITE_URL = "https://new.arnavm.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Arnav Murthi — Full-Stack Developer",
  description:
    "Full-stack developer, founder, and freelance developer based in Chapel Hill, NC. Builder of ProfitGreen, Disthread, HireSpace, and more.",
  openGraph: {
    title: "Arnav Murthi — Full-Stack Developer",
    description:
      "Full-stack developer, founder, and freelance developer based in Chapel Hill, NC.",
    url: "/",
    siteName: "Arnav Murthi",
    type: "website",
    // Square icon so link embeds (Discord etc.) show a compact thumbnail.
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  // "summary" (not summary_large_image) keeps Discord's thumbnail small and
  // on the right instead of full-width at the bottom.
  twitter: {
    card: "summary",
  },
};

export const viewport: Viewport = {
  // Accent used by link embeds (Discord's sidebar color) and mobile chrome.
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${dmMono.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
