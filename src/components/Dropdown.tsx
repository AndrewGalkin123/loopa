"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface DropdownProps {
  /** Content of the toggle button. */
  label: ReactNode;
  buttonClassName: string;
  /** Class of the wrapper (needs position: relative in CSS). */
  wrapClassName: string;
  /** Class of the menu; "open" is added while it is shown. */
  menuClassName: string;
  children: ReactNode;
}

/** Button with a menu that opens on click and closes on a choice or on any click outside. */
export function Dropdown({ label, buttonClassName, wrapClassName, menuClassName, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, [open]);

  return (
    <div className={wrapClassName} ref={wrapRef}>
      <button
        type="button"
        className={buttonClassName}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
      </button>
      {/* Choosing an item (any click inside the menu) closes it. */}
      <div className={open ? `${menuClassName} open` : menuClassName} onClick={() => setOpen(false)}>
        {children}
      </div>
    </div>
  );
}
