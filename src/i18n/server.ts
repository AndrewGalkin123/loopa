import { lang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { messagesFor } from "./messages";
import { makeTranslator, type Translator } from "./translate";

/* The language in Server Components: read from the address (/[lang]/…), so it never has to be passed down. */

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getTranslator(): Promise<Translator> {
  const locale = await getLocale();
  return makeTranslator(locale, messagesFor(locale));
}
