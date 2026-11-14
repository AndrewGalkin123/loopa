import { useSyncExternalStore } from "react";
import type { Session } from "@/lib/study";

/*
 * The research session kept in this browser (localStorage), so that reloading the
 * page during a block loses nothing. Only this browser has it, until the researcher
 * downloads the log and deletes it.
 */

const KEY = "loopa-study-session";
/** undefined = not read from the storage yet. */
let current: Session | null | undefined;
const listeners = new Set<() => void>();

function read(): Session | null {
  if (current === undefined) {
    try {
      const saved = localStorage.getItem(KEY);
      current = saved ? (JSON.parse(saved) as Session) : null;
    } catch {
      current = null;
    }
  }
  return current;
}

export function setSession(next: Session | null) {
  current = next;
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
  } catch {
    // Without the storage the session still runs; only a reload would lose it.
  }
  listeners.forEach((listener) => listener());
}

export function updateSession(change: (session: Session) => Session) {
  const session = read();
  if (session) setSession(change(session));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The session of this browser; undefined on the server, where the storage is not known. */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}
