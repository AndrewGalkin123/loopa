import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

// next/font downloads the fonts at build time and serves them from our own
// domain; each font is exposed as a CSS variable used in globals.css.
const inter = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-inter" });
const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});
// Symbols missing from the font (▲, ✕, ⌘ …) fall back to the system monospace
// font, as in the design, instead of the Arial-based fallback next/font adds.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["monospace"],
});

/** The classes that define the font variables, for <html> of every root layout. */
export const fontVariables = `${inter.variable} ${serif.variable} ${mono.variable}`;
