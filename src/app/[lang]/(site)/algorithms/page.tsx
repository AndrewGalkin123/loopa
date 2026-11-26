import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/algorithms/CatalogBrowser";
import { getTranslator } from "@/i18n/server";
import { CATALOG } from "@/lib/catalog";
import "./algorithms.css";

export const metadata: Metadata = {
	title: "Algorithms — Loopa",
};

export default async function AlgorithmsPage() {
	const { t, tn } = await getTranslator();
	return (
		<main className="page-algorithms">
			{/* ───────── PAGE HEAD ───────── */}
			<section className="page-head">
				<div>
					<div className="eyebrow">/ algorithms</div>
					<h1>Algorithms</h1>
					<p className="subtitle">
						{tn("catalog.count", CATALOG.length)}. <em>{t("catalog.tagline")}</em>
					</p>
				</div>
				<div className="meta">
					<div className="row">
						<span className="dot" /> updated 06.2026
					</div>
					<div className="row" style={{ color: "var(--color-text-dim)" }}>
						v1.0 · {CATALOG.length} entries
					</div>
				</div>
			</section>

			{/* ───────── FILTERS + RESULTS + GRID ───────── */}
			<CatalogBrowser />
		</main>
	);
}
