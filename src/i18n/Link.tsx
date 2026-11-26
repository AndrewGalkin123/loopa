"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./client";
import { localizeHref } from "./config";

/** next/link that keeps the language: on the English site "/algorithms" leads to "/en/algorithms". */
export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  return <NextLink href={typeof href === "string" ? localizeHref(href, locale) : href} {...props} />;
}
