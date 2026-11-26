import type { ReactNode } from "react";
import { I18nProvider } from "@/i18n/client";
import { messagesFor } from "@/i18n/messages";
import { fontVariables } from "../fonts";
import "../globals.css";

/* The root layout of the research session: Czech only, like the tests of the research. */
export default function StudyLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs" data-theme="dark" data-scroll-behavior="smooth" className={fontVariables}>
      <body>
        <I18nProvider locale="cs" messages={messagesFor("cs")}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
