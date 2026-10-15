"use client";

import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/algorithms", label: "Algorithms" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
];

// As in the design, the landing page highlights "Algorithms".
function activeHref(pathname: string) {
  if (pathname === "/" || pathname.startsWith("/algorithms")) return "/algorithms";
  return pathname;
}

export function SiteHeader() {
  const pathname = usePathname();
  const isDesignSystem = pathname === "/design-system";
  const links = isDesignSystem ? [{ href: "/design-system", label: "Design\u00a0System" }, ...LINKS] : LINKS;
  const active = activeHref(pathname);

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
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <button type="button" className="btn btn-secondary btn-sm">
            <Search size={14} /> Search <span className="kbd-inline">⌘K</span>
          </button>
          {isDesignSystem && <ThemeToggle />}
          <button type="button" className="btn btn-ghost btn-sm">
            CS <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </header>
  );
}
