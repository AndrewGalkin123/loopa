import type { BarClass } from "@/components/VizBars";

/*
 * Step lists for the decorative demos on the landing page.
 * Ported from the <script> in design/Landing.html: every step is a snapshot
 * of the array plus what is happening (compare / swap) and the counters.
 */

export interface BubbleStep {
  kind: "cmp" | "swp" | "done";
  a: number[];
  /** Left index of the compared/swapped pair. */
  j: number;
  /** Indices from here to the end are in their final place. */
  sortedFrom: number;
  cmp: number;
  swp: number;
}

export function buildBubbleSteps(input: number[]): BubbleStep[] {
  const steps: BubbleStep[] = [];
  const a = [...input];
  const n = a.length;
  let cmp = 0;
  let swp = 0;
  let sortedFrom = n;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      cmp++;
      steps.push({ kind: "cmp", a: [...a], j, sortedFrom, cmp, swp });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swp++;
        swapped = true;
        steps.push({ kind: "swp", a: [...a], j, sortedFrom, cmp, swp });
      }
    }
    sortedFrom = n - i - 1;
    if (!swapped) break;
  }
  steps.push({ kind: "done", a: [...a], j: -1, sortedFrom: 0, cmp, swp });
  return steps;
}

export function bubbleClass(step: BubbleStep, i: number): BarClass {
  if (i >= step.sortedFrom) return "sorted";
  if (step.kind !== "done" && (i === step.j || i === step.j + 1)) {
    return step.kind === "swp" ? "active" : "compared";
  }
  return "";
}

export interface QuickStep {
  kind: "cmp" | "swp" | "place" | "done";
  a: number[];
  pivot: number;
  j: number;
  done: Set<number>;
  cmp: number;
  swp: number;
}

export function buildQuickSteps(input: number[]): QuickStep[] {
  const a = [...input];
  const steps: QuickStep[] = [];
  let cmp = 0;
  let swp = 0;
  const done = new Set<number>();

  function partition(lo: number, hi: number): number {
    const pivotIdx = hi;
    const pivot = a[pivotIdx];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      cmp++;
      steps.push({ kind: "cmp", a: [...a], pivot: pivotIdx, j, done: new Set(done), cmp, swp });
      if (a[j] < pivot) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swp++;
          steps.push({ kind: "swp", a: [...a], pivot: pivotIdx, j, done: new Set(done), cmp, swp });
        }
        i++;
      }
    }
    if (i !== hi) {
      [a[i], a[hi]] = [a[hi], a[i]];
      swp++;
    }
    done.add(i);
    steps.push({ kind: "place", a: [...a], pivot: i, j: -1, done: new Set(done), cmp, swp });
    return i;
  }

  function quickSort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) done.add(lo);
      return;
    }
    const p = partition(lo, hi);
    quickSort(lo, p - 1);
    quickSort(p + 1, hi);
  }

  quickSort(0, a.length - 1);
  const all = new Set(Array.from({ length: a.length }, (_, k) => k));
  steps.push({ kind: "done", a: [...a], pivot: -1, j: -1, done: all, cmp, swp });
  return steps;
}

export function quickClass(step: QuickStep, i: number): BarClass {
  if (step.done.has(i)) return "sorted";
  if (i === step.pivot) return "pivot";
  if (step.kind !== "done" && i === step.j) return step.kind === "swp" ? "active" : "compared";
  return "";
}

/** 7 → "07" */
export function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}

export function randomArray(n: number, min = 2, max = 30): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function shuffled(values: number[]): number[] {
  return [...values].sort(() => Math.random() - 0.5);
}
