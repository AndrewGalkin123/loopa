import { Sparkles } from "lucide-react";

interface AiFabProps {
  label: string;
  ariaLabel: string;
  /** Hide the text on narrow screens (algorithm page). */
  collapsible?: boolean;
}

/** Floating "ask the AI" button in the bottom-right corner. */
export function AiFab({ label, ariaLabel, collapsible = false }: AiFabProps) {
  return (
    <button type="button" className="ai-fab" aria-label={ariaLabel}>
      <Sparkles className="spark" size={16} />
      <span className={collapsible ? "label-text" : undefined}>{label}</span>
    </button>
  );
}
