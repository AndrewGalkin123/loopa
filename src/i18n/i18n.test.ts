import { describe, expect, test } from "vitest";
import { localizeHref, pick, switchLocale, tx } from "./config";
import { cs } from "./messages/cs";
import { en } from "./messages/en";
import { ru } from "./messages/ru";
import { messagesFor } from "./messages";
import { preferredLocale } from "./negotiate";
import { makeTranslator } from "./translate";

describe("addresses with a language", () => {
  test("a link gets the language of the page; other links stay", () => {
    expect(localizeHref("/algorithms/bfs", "en")).toBe("/en/algorithms/bfs");
    expect(localizeHref("/", "ru")).toBe("/ru");
    expect(localizeHref("/compare?a=bubble-sort&b=quick-sort", "en")).toBe("/en/compare?a=bubble-sort&b=quick-sort");
    expect(localizeHref("/cs/about", "en")).toBe("/cs/about");
    expect(localizeHref("/study", "en")).toBe("/study");
    expect(localizeHref("#", "en")).toBe("#");
    expect(localizeHref("mailto:a@b.cz", "en")).toBe("mailto:a@b.cz");
  });

  test("the same page in another language", () => {
    expect(switchLocale("/cs/algorithms/bfs", "en")).toBe("/en/algorithms/bfs");
    expect(switchLocale("/en", "cs")).toBe("/cs");
    expect(switchLocale("/algorithms", "ru")).toBe("/ru/algorithms");
  });
});

describe("the language of a visitor without one", () => {
  test("the language chosen before wins", () => {
    expect(preferredLocale("en", "cs-CZ,cs;q=0.9")).toBe("en");
  });

  test("else the first supported language of the browser, by its weight", () => {
    expect(preferredLocale(undefined, "de-DE,de;q=0.9,ru;q=0.7,en;q=0.8")).toBe("en");
    expect(preferredLocale(undefined, "ru-RU")).toBe("ru");
    expect(preferredLocale("xx", "fr;q=0.9, en;q=0")).toBe("cs");
  });

  test("else Czech", () => {
    expect(preferredLocale(undefined, null)).toBe("cs");
    expect(preferredLocale(undefined, "de, fr")).toBe("cs");
  });
});

describe("texts in several languages", () => {
  test("a missing translation shows the Czech text; a plain string is Czech", () => {
    expect(pick({ cs: "ahoj", en: "hello" }, "en")).toBe("hello");
    expect(pick({ cs: "ahoj" }, "ru")).toBe("ahoj");
    expect(tx("jen česky", "en")).toBe("jen česky");
  });

  test("placeholders and Czech plurals", () => {
    const { t, tn } = makeTranslator("cs", messagesFor("cs"));
    expect(t("tasks.solved", { done: 2, total: 3 })).toBe("2 / 3 splněno");
    expect([1, 2, 4, 5, 14].map((n) => tn("catalog.count", n))).toEqual([
      "1 algoritmus",
      "2 algoritmy",
      "4 algoritmy",
      "5 algoritmů",
      "14 algoritmů",
    ]);
  });

  test("English plurals; Russian falls back to Czech where it has no text", () => {
    expect(makeTranslator("en", messagesFor("en")).tn("catalog.count", 1)).toBe("1 algorithm");
    expect(makeTranslator("en", messagesFor("en")).tn("catalog.count", 14)).toBe("14 algorithms");
    expect(makeTranslator("ru", messagesFor("ru")).t("tasks.hint")).toBe(cs["tasks.hint"]);
  });
});

describe("the dictionaries", () => {
  const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

  test("English has every Czech key, nothing empty, and the same placeholders", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(cs).sort());
    for (const key of Object.keys(cs) as (keyof typeof cs)[]) {
      expect(en[key].trim().length, key).toBeGreaterThan(0);
      expect(placeholders(en[key]), key).toEqual(placeholders(cs[key]));
    }
  });

  test("Russian has only keys that exist in Czech", () => {
    for (const key of Object.keys(ru)) expect(Object.keys(cs)).toContain(key);
  });
});
