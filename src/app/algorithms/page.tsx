import type { Metadata } from "next";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { FilterBar } from "@/components/algorithms/FilterBar";
import { CATALOG } from "@/lib/catalog";
import "./algorithms.css";

export const metadata: Metadata = {
	title: "Algorithms — Loopa",
};

export default function AlgorithmsPage() {
	return (
		<main className="page-algorithms">
			{/* ───────── PAGE HEAD ───────── */}
			<section className="page-head">
				<div>
					<div className="eyebrow">/ algorithms</div>
					<h1>Algorithms</h1>
					<p className="subtitle">
						9 algoritmů. <em>Vysvětlené pořádně.</em>
					</p>
				</div>
				<div className="meta">
					<div className="row">
						<span className="dot" /> updated 06.2026
					</div>
					<div className="row" style={{ color: "var(--color-text-dim)" }}>
						v1.0 · 9 entries
					</div>
				</div>
			</section>

			{/* ───────── FILTER BAR ───────── */}
			<FilterBar />

			{/* ───────── RESULT STRIP ───────── */}
			<div className="result-strip">
				<div>
					<span className="accent">9</span> results{" "}
					<span className="crumb">·</span> group{" "}
					<span className="accent">sorting</span>{" "}
					<span className="crumb">·</span> sorted by name
				</div>
				<button className="reset">reset filters ↺</button>
			</div>

			{/* ───────── GRID ───────── */}
			<section className="grid">
				{CATALOG.map((card) => (
					<AlgorithmCard key={card.num} {...card} />
				))}
			</section>
		</main>
	);
}
