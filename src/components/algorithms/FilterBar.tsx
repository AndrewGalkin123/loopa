"use client";

import { ChevronDown, Search } from "lucide-react";
import type { Ref } from "react";
import { Dropdown } from "@/components/Dropdown";
import { CATEGORIES, LEVELS, SORTS, type CatalogFilters } from "@/lib/catalogFilters";

interface Chip<Id extends string> {
  id: Id;
  label: string;
  count?: number;
}

/** One row of chips; exactly one chip is active. */
function ChipSet<Id extends string>({ label, chips, active, onSelect }: {
  label: string;
  chips: Chip<Id>[];
  active: Id;
  onSelect: (id: Id) => void;
}) {
  return (
    <div className="filter-set" role="group" aria-label={label}>
      <span className="filter-label">{label}</span>
      {chips.map((chip) => (
        <button
          key={chip.id}
          className={chip.id === active ? "chip active" : "chip"}
          aria-pressed={chip.id === active}
          onClick={() => onSelect(chip.id)}
        >
          {chip.label}
          {chip.count !== undefined && <span className="count">{chip.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Sticky search + filters above the catalog. It only shows the filters; CatalogBrowser keeps their state. */
export function FilterBar({ filters, counts, onChange, searchRef }: {
  filters: CatalogFilters;
  /** Number of cards in each group chip. */
  counts: Record<string, number>;
  onChange: (change: Partial<CatalogFilters>) => void;
  searchRef: Ref<HTMLInputElement>;
}) {
  const sortLabel = SORTS.find((s) => s.id === filters.sort)!.label;

  return (
    <section className="filter-bar">
      <div className="filter-row">
        <div className="filter-search">
          <Search size={16} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Hledat algoritmus…"
            aria-label="Hledat algoritmus"
            value={filters.query}
            onChange={(event) => onChange({ query: event.target.value })}
            // Esc clears the search.
            onKeyDown={(event) => {
              if (event.key === "Escape") onChange({ query: "" });
            }}
          />
          <span className="kbd-inline">⌘K</span>
        </div>

        <Dropdown
          wrapClassName="sort-wrap"
          buttonClassName="sort-select"
          menuClassName="sort-menu"
          label={
            <>
              <span className="lbl">sort</span>
              <span>{sortLabel}</span>
              <ChevronDown size={14} style={{ color: "var(--color-text-subtle)" }} />
            </>
          }
        >
          {SORTS.map((sort) => (
            <button
              key={sort.id}
              className={sort.id === filters.sort ? "on" : undefined}
              onClick={() => onChange({ sort: sort.id })}
            >
              {sort.label}
            </button>
          ))}
        </Dropdown>
      </div>

      <div className="filter-groups">
        <ChipSet
          label="group"
          chips={CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: counts[c.id] }))}
          active={filters.category}
          onSelect={(category) => onChange({ category })}
        />
        <ChipSet label="level" chips={LEVELS} active={filters.level} onSelect={(level) => onChange({ level })} />
      </div>
    </section>
  );
}
