import { expect, test } from "vitest";
import { CONTENT } from "@/algorithms/content";
import { LOCALES } from "@/i18n/config";

/*
 * A translated algorithm page must say the same as the Czech one: the same code,
 * the same rows of the complexity table and the same links. Only the words differ.
 */
const translations = Object.entries(CONTENT).flatMap(([slug, texts]) =>
  LOCALES.filter((locale) => locale !== "cs" && texts[locale]).map((locale) => ({ slug, locale, cs: texts.cs, other: texts[locale]! })),
);

test("at least Bubble Sort is translated into English", () => {
  expect(translations.map((t) => `${t.slug}:${t.locale}`)).toContain("bubble-sort:en");
});

test.each(translations.map((t) => [`${t.slug} (${t.locale})`, t] as const))("%s has the structure of the Czech page", (_, { cs, other }) => {
  expect(other.pseudocode).toBe(cs.pseudocode);
  expect(other.implementations).toBe(cs.implementations);
  expect(other.complexityCases.map((c) => [c.label, c.bigO, c.tone])).toEqual(cs.complexityCases.map((c) => [c.label, c.bigO, c.tone]));
  expect(other.compareWith).toEqual(cs.compareWith);
  expect(other.related).toEqual(cs.related);
  expect(other.next.href).toBe(cs.next.href);
  expect(other.readMinutes).toBe(cs.readMinutes);
  expect(Boolean(other.complexityChart)).toBe(Boolean(cs.complexityChart));
});
