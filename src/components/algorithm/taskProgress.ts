import { useSyncExternalStore } from "react";

/*
 * Which tasks of an algorithm this browser has solved (localStorage), so the ticks
 * survive a reload. Only a convenience: without the storage the tasks still work.
 */

const keyOf = (slug: string) => `loopa-tasks-${slug}`;
const solved = new Map<string, string[]>();
const listeners = new Set<() => void>();
const NONE: string[] = [];

function read(slug: string): string[] {
  if (!solved.has(slug)) {
    let ids: unknown = [];
    try {
      ids = JSON.parse(localStorage.getItem(keyOf(slug)) ?? "[]");
    } catch {
      // A broken or blocked storage: start with nothing solved.
    }
    solved.set(slug, Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : []);
  }
  return solved.get(slug)!;
}

function write(slug: string, ids: string[]) {
  solved.set(slug, ids);
  try {
    localStorage.setItem(keyOf(slug), JSON.stringify(ids));
  } catch {
    // Only this page load remembers it.
  }
  listeners.forEach((listener) => listener());
}

export function markSolved(slug: string, id: string) {
  const ids = read(slug);
  if (!ids.includes(id)) write(slug, [...ids, id]);
}

export function forgetSolved(slug: string) {
  write(slug, []);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Ids of the solved tasks; none on the server, where the storage is not known. */
export function useSolved(slug: string): string[] {
  return useSyncExternalStore(subscribe, () => read(slug), () => NONE);
}
