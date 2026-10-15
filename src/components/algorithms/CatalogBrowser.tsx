"use client";

import { SearchX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { CATALOG } from "@/lib/catalog";
import {
  CATEGORIES,
  DEFAULT_FILTERS,
  filterCatalog,
  inCategory,
  SORTS,
  type CatalogFilters,
} from "@/lib/catalogFilters";
import { FilterBar } from "./FilterBar";

/** Cards per group chip; they do not change, so they are counted once. */
const COUNTS = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, CATALOG.filter((card) => inCategory(card, c.id)).length]),
);

/** The interactive part of the catalog: filters, result strip and the grid of cards. */
export function CatalogBrowser() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const searchRef = useRef<HTMLInputElement>(null);

  const cards = filterCatalog(CATALOG, filters);
  const change = (change: Partial<CatalogFilters>) => setFilters((current) => ({ ...current, ...change }));
  const reset = () => setFilters(DEFAULT_FILTERS);

  const category = CATEGORIES.find((c) => c.id === filters.category)!.label.toLowerCase();
  const sort = SORTS.find((s) => s.id === filters.sort)!.label;
  const query = filters.query.trim();

  // ⌘K (Ctrl+K on Windows) jumps to the search field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <FilterBar filters={filters} counts={COUNTS} onChange={change} searchRef={searchRef} />

      {/* ───────── RESULT STRIP ───────── */}
      <div className="result-strip" aria-live="polite">
        <div>
          <span className="accent">{cards.length}</span> {cards.length === 1 ? "result" : "results"}{" "}
          <span className="crumb">·</span> group <span className="accent">{category}</span>{" "}
          {filters.level !== "all" && (
            <>
              <span className="crumb">·</span> level <span className="accent">{filters.level}</span>{" "}
            </>
          )}
          {query && (
            <>
              <span className="crumb">·</span> query <span className="accent">&quot;{query}&quot;</span>{" "}
            </>
          )}
          <span className="crumb">·</span> sorted {sort}
        </div>
        <button className="reset" onClick={reset}>
          reset filters ↺
        </button>
      </div>

      {/* ───────── GRID ───────── */}
      <section className="grid">
        {cards.map((card) => (
          <AlgorithmCard key={card.num} {...card} />
        ))}

        {cards.length === 0 && (
          <div className="empty">
            <div className="icon-wrap">
              <SearchX size={20} />
            </div>
            <h3>Nic nenalezeno</h3>
            <p>
              Zkuste jiný dotaz nebo{" "}
              <button className="link" onClick={reset}>
                resetujte filtry
              </button>
              .
            </p>
            <span className="query">
              {query && (
                <>
                  query: <b>&quot;{query}&quot;</b> ·{" "}
                </>
              )}
              group: <b>{category}</b>
              {filters.level !== "all" && (
                <>
                  {" "}
                  · level: <b>{filters.level}</b>
                </>
              )}
            </span>
          </div>
        )}
      </section>
    </>
  );
}
