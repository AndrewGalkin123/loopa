import { tx, type Locale, type Text } from "./config";
import type { cs } from "./messages/cs";

/* Looking up the short texts of the interface (the messages in src/i18n/messages). */

export type MessageKey = keyof typeof cs;
export type Messages = Record<MessageKey, string>;
type Params = Record<string, string | number>;

/** Keys of plural messages: "catalog.count" stands for "catalog.count.one", "catalog.count.few", … "catalog.count.other". */
export type PluralKey = { [K in MessageKey]: K extends `${infer Base}.other` ? Base : never }[MessageKey];

export interface Translator {
  locale: Locale;
  /** "nav.search" → "Hledat"; "{n}" and other placeholders are filled from `params`. */
  t(key: MessageKey, params?: Params): string;
  /** A message with the plural form for `count` (Czech: 1 algoritmus, 2 algoritmy, 5 algoritmů); {n} is the count. */
  tn(key: PluralKey, count: number, params?: Params): string;
  /** A text of a module or a model in this language (Czech where there is no translation yet). */
  tx(text: Text): string;
}

function format(message: string, params?: Params) {
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (placeholder, name: string) => (name in params ? String(params[name]) : placeholder));
}

export function makeTranslator(locale: Locale, messages: Messages): Translator {
  const plural = new Intl.PluralRules(locale);
  return {
    locale,
    t: (key, params) => format(messages[key], params),
    tn: (key, count, params) => {
      const form = messages[`${key}.${plural.select(count)}` as MessageKey] ?? messages[`${key}.other` as MessageKey];
      return format(form, { n: count, ...params });
    },
    tx: (text) => tx(text, locale),
  };
}
