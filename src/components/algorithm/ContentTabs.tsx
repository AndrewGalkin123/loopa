"use client";

import { useEffect, useState } from "react";

interface Tab {
  /** id of the section the tab scrolls to */
  id: string;
  label: string;
}

/**
 * Sticky tabs above the algorithm content. Clicking scrolls to the section;
 * while scrolling, the tab of the section in view is highlighted (scroll-spy).
 */
export function ContentTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Only the band just under the sticky header counts as "in view".
      { rootMargin: "-160px 0px -65% 0px", threshold: 0 },
    );
    for (const tab of tabs) {
      const section = document.getElementById(tab.id);
      if (section) spy.observe(section);
    }
    return () => spy.disconnect();
  }, [tabs]);

  return (
    <div className="tabs">
      {tabs.map((tab, i) => (
        <a
          key={tab.id}
          href={`#${tab.id}`}
          className={tab.id === active ? "tab active" : "tab"}
          onClick={() => setActive(tab.id)}
        >
          <span className="n">{String(i + 1).padStart(2, "0")}</span>
          {tab.label}
        </a>
      ))}
    </div>
  );
}
