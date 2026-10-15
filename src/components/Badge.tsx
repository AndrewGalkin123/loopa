import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type BadgeVariant = "sorting" | "search-sorted" | "graph" | "shortest" | "optimization";

export interface BadgeProps {
  variant: BadgeVariant;
  icon: LucideIcon;
  children: ReactNode;
}

/** Small outlined label with an icon, e.g. "⚡ fast". Colour comes from the variant. */
export function Badge({ variant, icon: Icon, children }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      <Icon /> {children}
    </span>
  );
}
