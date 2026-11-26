import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/*
 * Layout of the public site: header, page, footer. It is a route group, "(site)"
 * is not part of the address. Pages outside the group (the research session,
 * /study) are shown without the site navigation.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
