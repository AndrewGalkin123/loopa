"use client";

import { useState, type CSSProperties } from "react";

interface TabItem {
  label: string;
  style?: CSSProperties;
}

/** Row of buttons where exactly one is active; clicking another moves the highlight. */
export function TabGroup({ className, itemClassName, items }: {
  className: string;
  itemClassName: string;
  items: TabItem[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div className={className}>
      {items.map((item, i) => (
        <button
          key={item.label}
          className={i === active ? `${itemClassName} active` : itemClassName}
          style={item.style}
          onClick={() => setActive(i)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
