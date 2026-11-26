"use client";

import { ChevronDown, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n/client";
import { LOCALE_NAMES, LOCALES, switchLocale, type Locale } from "@/i18n/config";
import { Link } from "@/i18n/Link";
import { LOCALE_COOKIE } from "@/i18n/negotiate";
import type { MessageKey } from "@/i18n/translate";
import { BrandMark } from "./BrandMark";
import { Dropdown } from "./Dropdown";
import { ThemeToggle } from "./ThemeToggle";

const LINKS: { href: string; label: MessageKey }[] = [
  { href: "/algorithms", label: "nav.algorithms" },
  { href: "/compare", label: "nav.compare" },
  { href: "/about", label: "nav.about" },
];

// As in the design, the landing page highlights "Algorithms".
function activeHref(path: string) {
  if (path === "/" || path.startsWith("/algorithms")) return "/algorithms";
  return path;
}

/** Another language: the same page, and the choice is remembered for the next visit of "/". */
function chooseLocale(pathname: string, locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  window.location.assign(switchLocale(pathname, locale) + window.location.search + window.location.hash);
}

export function SiteHeader() {
  const { t, locale } = useT();
  const pathname = usePathname();
  // The address without its language: "/en/algorithms" → "/algorithms".
  const path = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
  const isDesignSystem = path === "/design-system";
  const links = isDesignSystem ? [{ href: "/design-system", label: "nav.designSystem" as const }, ...LINKS] : LINKS;
  const active = activeHref(path);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <BrandMark />
          <span>Loopa</span>
        </Link>
        <nav className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={link.href === active ? "active" : undefined}>
              {t(link.label)}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <button type="button" className="btn btn-secondary btn-sm">
            <Search size={14} /> {t("nav.search")} <span className="kbd-inline">⌘K</span>
          </button>
          {isDesignSystem && <ThemeToggle />}
          <Dropdown
            wrapClassName="lang-wrap"
            buttonClassName="btn btn-ghost btn-sm"
            menuClassName="lang-menu"
            label={
              <>
                <span aria-label={t("nav.language")}>{locale.toUpperCase()}</span> <ChevronDown size={12} />
              </>
            }
          >
            {LOCALES.map((option) => (
              <a
                key={option}
                href={switchLocale(pathname, option)}
                hrefLang={option}
                className={option === locale ? "cur" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  chooseLocale(pathname, option);
                }}
              >
                {LOCALE_NAMES[option]} <span className="code">{option}</span>
              </a>
            ))}
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
