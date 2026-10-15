"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Dark / light switch from the design system page. Only that page was designed
 * in both themes, so leaving it switches the site back to dark.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => () => applyTheme("dark"), []);

  const choose = (next: Theme) => {
    setTheme(next);
    applyTheme(next);
  };

  return (
    <div className="theme-toggle">
      <button type="button" className={theme === "dark" ? "is-on" : undefined} title="Dark" onClick={() => choose("dark")}>
        <Moon size={14} />
      </button>
      <button type="button" className={theme === "light" ? "is-on" : undefined} title="Light" onClick={() => choose("light")}>
        <Sun size={14} />
      </button>
    </div>
  );
}
