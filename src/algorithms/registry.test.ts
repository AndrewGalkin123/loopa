import { expect, test } from "vitest";
import { CONTENT } from "@/algorithms/content";
import { ALGORITHMS } from "@/algorithms/registry";
import { CATALOG } from "@/lib/catalog";

/* The registry, the page texts and the catalog must agree with each other. */

test("slugs are unique", () => {
  const slugs = ALGORITHMS.map((a) => a.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
});

test("every algorithm has page texts and nothing else does", () => {
  expect(Object.keys(CONTENT).sort()).toEqual(ALGORITHMS.map((a) => a.slug).sort());
});

test("every algorithm is in the catalog and links to its page", () => {
  for (const definition of ALGORITHMS) {
    const card = CATALOG.find((c) => c.slug === definition.slug);
    expect(card?.href).toBe(`/algorithms/${definition.slug}`);
  }
});

test('"related" cards on the algorithm pages exist in the catalog', () => {
  for (const [slug, content] of Object.entries(CONTENT)) {
    for (const related of content.related) {
      expect(CATALOG.map((c) => c.slug), `${slug} → ${related}`).toContain(related);
    }
  }
});

test("catalog cards are numbered 01, 02, … in order", () => {
  expect(CATALOG.map((c) => c.num)).toEqual(CATALOG.map((_, i) => String(i + 1).padStart(2, "0")));
});
