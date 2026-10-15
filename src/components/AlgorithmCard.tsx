import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Badge, type BadgeProps } from "./Badge";

export interface AlgorithmCardData {
  num: string;
  group: string;
  badge: { variant: BadgeProps["variant"]; icon: BadgeProps["icon"]; label: string };
  title: string;
  tagline: string;
  description: ReactNode;
  complexity: string;
  level: string;
  href?: string;
}

interface AlgorithmCardProps extends AlgorithmCardData {
  className?: string;
  style?: CSSProperties;
}

/** Catalog card used on the landing page, the catalog and "related" sections. */
export function AlgorithmCard({
  num,
  group,
  badge,
  title,
  tagline,
  description,
  complexity,
  level,
  href = "#",
  className,
  style,
}: AlgorithmCardProps) {
  return (
    <Link className={className ? `card ${className}` : "card"} href={href} style={style}>
      <div className="card-top">
        <span className="card-num">
          {num} <b>/ {group}</b>
        </span>
        <Badge variant={badge.variant} icon={badge.icon}>
          {badge.label}
        </Badge>
      </div>
      <h3 className="card-title">
        {title} <em>— {tagline}</em>
      </h3>
      <p className="card-desc">{description}</p>
      <div className="card-foot">
        <span>{complexity}</span>
        <span>{level}</span>
      </div>
    </Link>
  );
}
