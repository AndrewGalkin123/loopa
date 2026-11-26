import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/config";
import { LOCALE_COOKIE, preferredLocale } from "@/i18n/negotiate";

/*
 * Every page of the site has its language at the start of the address (/cs/…, /en/…).
 * An address without it — "/", an old link — is redirected to the visitor's language.
 * The research session /study has no language: it is Czech only.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first) || first === "study") return;

  const locale = preferredLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Not the files of Next.js and not files with an extension (icons, images).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
