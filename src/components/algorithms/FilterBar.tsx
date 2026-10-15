"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";

interface Chip {
  label: string;
  count?: number;
}

const GROUPS: Chip[] = [
  { label: "All", count: 9 },
  { label: "Sorting", count: 3 },
  { label: "Search", count: 2 },
  { label: "Graphs", count: 3 },
  { label: "Math", count: 1 },
];

const LEVELS: Chip[] = [{ label: "All" }, { label: "Beginner" }, { label: "Intermediate" }, { label: "Advanced" }];

/** One row of chips; exactly one chip is active (single-select, as in the design). */
function ChipSet({ label, chips, initial }: { label: string; chips: Chip[]; initial: number | null }) {
  const [active, setActive] = useState(initial);
  return (
    <div className="filter-set">
      <span className="filter-label">{label}</span>
      {chips.map((chip, i) => (
        <button key={chip.label} className={i === active ? "chip active" : "chip"} onClick={() => setActive(i)}>
          {chip.label}
          {chip.count !== undefined && <span className="count">{chip.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Sticky search + filters above the catalog. Only the chip highlight works so far. */
export function FilterBar() {
  return (
    <section className="filter-bar">
      <div className="filter-row">
        <div className="filter-search">
          <Search size={16} />
          <input type="text" placeholder="Hledat algoritmus…" />
          <span className="kbd-inline">⌘K</span>
        </div>
        <button className="sort-select" style={{ marginLeft: "auto" }} aria-label="Sort">
          <span className="lbl">sort</span>
          <span>by name</span>
          <ChevronDown size={14} style={{ color: "var(--color-text-subtle)" }} />
        </button>
      </div>

      <div className="filter-groups">
        <ChipSet label="group" chips={GROUPS} initial={1} />
        <ChipSet label="level" chips={LEVELS} initial={null} />
      </div>
    </section>
  );
}
