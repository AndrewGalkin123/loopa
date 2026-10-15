import { Fragment, type ReactNode } from "react";

/*
 * Syntax-highlight tokens for hand-written code samples.
 * Colours come from the .tok-* classes in the page CSS.
 */

type TokenProps = { children: ReactNode };

/** keyword */
export const K = ({ children }: TokenProps) => <span className="tok-k">{children}</span>;
/** function name */
export const F = ({ children }: TokenProps) => <span className="tok-f">{children}</span>;
/** punctuation / operator */
export const P = ({ children }: TokenProps) => <span className="tok-p">{children}</span>;
/** number */
export const N = ({ children }: TokenProps) => <span className="tok-n">{children}</span>;
/** comment */
export const C = ({ children }: TokenProps) => <span className="tok-c">{children}</span>;

/** One numbered line of a code block. */
export function CodeLine({ n, className, onClick, children }: {
  n: number;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <div className={className ? `cl ${className}` : "cl"} onClick={onClick}>
      <span className="ln">{n}</span>
      <span>{children}</span>
    </div>
  );
}

/**
 * Gives each line a key. Line arrays are passed from server to client
 * components, and React wants keys on every element inside an array.
 */
export function codeLines(lines: ReactNode[]): ReactNode[] {
  return lines.map((line, i) => <Fragment key={i}>{line}</Fragment>);
}
