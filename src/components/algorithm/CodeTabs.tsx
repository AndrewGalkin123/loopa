"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { CodeLine } from "@/components/code/tokens";

interface Implementation {
  id: string;
  label: string;
  lines: ReactNode[];
}

/** Implementation in several languages: language tabs + copy-to-clipboard button. */
export function CodeTabs({ implementations }: { implementations: Implementation[] }) {
  const [lang, setLang] = useState(implementations[0].id);
  const [copied, setCopied] = useState(false);
  const activePane = useRef<HTMLDivElement>(null);

  async function copy() {
    // Text of the visible pane without the line numbers.
    const lines = activePane.current?.querySelectorAll(".cl > span:last-child") ?? [];
    const text = Array.from(lines, (line) => line.textContent).join("\n");
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="code">
      <div className="code-tabs">
        {implementations.map((impl) => (
          <button
            key={impl.id}
            className={impl.id === lang ? "code-tab active" : "code-tab"}
            onClick={() => setLang(impl.id)}
          >
            {impl.label}
          </button>
        ))}
      </div>
      <button className="code-copy" onClick={copy}>
        {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "zkopírováno" : "kopírovat"}
      </button>

      {implementations.map((impl) => (
        <div
          key={impl.id}
          className={impl.id === lang ? "code-pane active" : "code-pane"}
          ref={impl.id === lang ? activePane : undefined}
        >
          <pre className="code-body" style={{ margin: 0 }}>
            {impl.lines.map((line, i) => (
              <CodeLine key={i} n={i + 1}>
                {line}
              </CodeLine>
            ))}
          </pre>
        </div>
      ))}
    </div>
  );
}
