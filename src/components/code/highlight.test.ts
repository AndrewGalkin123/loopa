import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { highlight } from "./highlight";

const html = (source: string, extra?: string[]) => renderToStaticMarkup(createElement(Fragment, null, highlight(source, "pseudo", extra)));

test("a keyword of the shared list is highlighted", () => {
  expect(html("for i ← 1 to n do")).toContain('<span class="tok-k">for</span>');
});

test("an extra keyword is highlighted only in the code that asks for it", () => {
  expect(html("for i ← n downto 1 do", ["downto"])).toContain('<span class="tok-k">downto</span>');
  expect(html("for i ← n downto 1 do")).not.toContain('<span class="tok-k">downto</span>');
});
