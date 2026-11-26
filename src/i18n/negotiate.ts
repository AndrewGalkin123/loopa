import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/** The cookie that remembers the language chosen in the menu. */
export const LOCALE_COOKIE = "loopa-lang";

/**
 * The language of a visitor who opens a page without one: the language chosen
 * before (the cookie), else the first supported one the browser asks for
 * (Accept-Language, by its weight q), else Czech.
 */
export function preferredLocale(cookie: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookie)) return cookie;
  const wanted = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, weight] = part.trim().split(";q=");
      return { language: tag.toLowerCase().split("-")[0], q: weight === undefined ? 1 : Number(weight) };
    })
    .filter((entry) => entry.language && entry.q > 0)
    .sort((a, b) => b.q - a.q);
  return wanted.map((entry) => entry.language).find(isLocale) ?? DEFAULT_LOCALE;
}
