import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

// next/font downloads the fonts at build time and serves them from our own
// domain; each font is exposed as a CSS variable used in globals.css.
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});
// Symbols missing from the font (▲, ✕, ⌘ …) fall back to the system monospace
// font, as in the design, instead of the Arial-based fallback next/font adds.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "Loopa — Algoritmy, vysvětlené vizuálně",
  description: "Interaktivní vizualizace matematických a algoritmických postupů.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="cs"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
