import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { I18nProvider } from "@/i18n/client";
import { isLocale, LOCALES } from "@/i18n/config";
import { messagesFor } from "@/i18n/messages";
import { getTranslator } from "@/i18n/server";
import { fontVariables } from "../fonts";
import "../globals.css";

/*
 * The root layout of the site in one language (/cs/…, /en/…, /ru/…). The research
 * session /study has its own root layout outside of the languages.
 */

// Only the languages of the site; any other first segment gives 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("meta.title"), description: t("meta.description") };
}

export default async function LanguageLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} data-theme="dark" data-scroll-behavior="smooth" className={fontVariables}>
      {/* The site header and footer are in [lang]/(site)/layout.tsx. */}
      <body>
        <I18nProvider locale={lang} messages={messagesFor(lang)}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
