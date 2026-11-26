import type { Locale } from "../config";
import type { Messages } from "../translate";
import { cs } from "./cs";
import { en } from "./en";
import { ru } from "./ru";

export const MESSAGES: Record<Locale, Partial<Messages>> = { cs, en, ru };

/** All messages of a language; a missing one is the Czech text. */
export function messagesFor(locale: Locale): Messages {
  return { ...cs, ...MESSAGES[locale] };
}
