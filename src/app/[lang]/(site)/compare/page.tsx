import type { Metadata } from "next";
import { AiFab } from "@/components/AiFab";
import { CompareWorkspace } from "@/components/compare/CompareWorkspace";
import { getTranslator } from "@/i18n/server";
import { resolveSlots } from "@/lib/compare";
import "./compare.css";

type Props = { searchParams: Promise<{ a?: string | string[]; b?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { a, b } = await searchParams;
  const [first, second] = resolveSlots(a, b);
  return { title: `${first.name} ✕ ${second.name} — Compare — Loopa` };
}

/** The compare mode. The address chooses the algorithms: /compare?a=bubble-sort&b=quick-sort */
export default async function ComparePage({ searchParams }: Props) {
  const { a, b } = await searchParams;
  const [first, second] = resolveSlots(a, b);
  const { t } = await getTranslator();
  return (
    <>
      <main className="page-compare">
        <CompareWorkspace slugA={first.slug} slugB={second.slug} />
      </main>
      <AiFab label={t("compare.ask")} ariaLabel={t("compare.askAria")} />
    </>
  );
}
