import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/algorithms/CatalogBrowser";
import { CATALOG } from "@/lib/catalog";
import "./algorithms.css";

export const metadata: Metadata = {
	title: "Algorithms — Loopa",
};

/** Czech plural: 1 algoritmus, 2–4 algoritmy, 5+ algoritmů. */
function algorithmsWord(n: number) {
	if (n === 1) return "algoritmus";
	if (n >= 2 && n <= 4) return "algoritmy";
	return "algoritmů";
}

export default function AlgorithmsPage() {
	return (
		<main className="page-algorithms">
			{/* ───────── PAGE HEAD ───────── */}
			<section className="page-head">
				<div>
					<div className="eyebrow">/ algorithms</div>
					<h1>Algorithms</h1>
					<p className="subtitle">
						{CATALOG.length} {algorithmsWord(CATALOG.length)}. <em>Vysvětlené pořádně.</em>
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
