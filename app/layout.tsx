import type { Metadata } from "next";
import { Elsie, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { MouseGlow } from "@/components/MouseGlow";

const elsie = Elsie({
  variable: "--font-elsie",
  subsets: ["latin"],
  weight: ["400", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arnavm.com"),
  title: "Arnav Murthi — Full-Stack Developer",
  description:
    "Full-stack developer, founder, and freelance developer based in Cary, NC. Builder of ProfitGreen, Disthread, HireSpace, and more.",
  openGraph: {
    title: "Arnav Murthi — Full-Stack Developer",
    description:
      "Full-stack developer, founder, and freelance developer based in Cary, NC.",
    url: "https://arnavm.com",
    siteName: "Arnav Murthi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${elsie.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MouseGlow />
        {children}
      </body>
    </html>
  );
}
