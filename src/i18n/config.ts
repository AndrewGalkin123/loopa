/*
 * The languages of the site. Czech is the default and the language every text
 * exists in first; English (required by the thesis) and Russian follow.
 */

export const LOCALES = ["cs", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "cs";

/** Each language in itself, for the language menu. */
export const LOCALE_NAMES: Record<Locale, string> = { cs: "Čeština", en: "English", ru: "Русский" };

export function isLocale(value: string | undefined): value is Locale {
  return (LOCALES as readonly string[]).includes(value ?? "");
}

/** A text in several languages. Czech is always there; where a translation is missing, the Czech text is shown. */
export type Localized<T = string> = { cs: T } & { [L in Exclude<Locale, "cs">]?: T };

/** A text of an algorithm module or a model: a plain string is Czech that has no translation yet. */
export type Text = string | Localized;

export function pick<T>(text: Localized<T>, locale: Locale): T {
  return text[locale] ?? text.cs;
}

export function tx(text: Text, locale: Locale): string {
  return typeof text === "string" ? text : pick(text, locale);
}

/** Is the text there in this language itself (not as the Czech fallback)? */
export function hasTranslation(text: Text | Localized<unknown>, locale: Locale): boolean {
  return locale === "cs" || (typeof text !== "string" && text[locale] !== undefined);
}

/** "/algorithms" → "/en/algorithms". Links to other sites, anchors, /study and paths with a language stay as they are. */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const first = href.split(/[/?#]/)[1];
  if (isLocale(first) || first === "study") return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/** The same page in another language: "/en/algorithms/bfs" → "/cs/algorithms/bfs". */
export function switchLocale(pathname: string, locale: Locale): string {
  const [, first, ...rest] = pathname.split("/");
  const tail = isLocale(first) ? rest : [first, ...rest].filter(Boolean);
  return `/${[locale, ...tail].join("/")}`;
}
