"use client";

import { createContext, use, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import { makeTranslator, type Messages, type Translator } from "./translate";

/* The language in Client Components: the layout of the page puts its messages here. */

const I18nContext = createContext<Translator | null>(null);

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  const translator = useMemo(() => makeTranslator(locale, messages), [locale, messages]);
  return <I18nContext value={translator}>{children}</I18nContext>;
}

export function useT(): Translator {
  const translator = use(I18nContext);
  if (!translator) throw new Error("useT() must be used inside <I18nProvider>");
  return translator;
}

export function useLocale(): Locale {
  return useT().locale;
}
