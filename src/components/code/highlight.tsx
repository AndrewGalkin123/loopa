import { Fragment, type ReactNode } from "react";
import { C, F, K, N, P } from "./tokens";

/*
 * Syntax highlighting of plain source code: the code is written as an ordinary
 * string and turned into the same tokens as the hand-written code of the sorting
 * pages (<K> keyword, <F> function, <P> punctuation, <N> number, <C> comment).
 */

export type Language = "pseudo" | "js" | "py" | "java";

const KEYWORDS: Record<Language, Set<string>> = {
  pseudo: new Set(["procedure", "for", "each", "of", "to", "do", "while", "if", "then", "else", "not", "and", "is",
    "return", "true", "false", "repeat", "times", "nil"]),
  js: new Set(["function", "const", "let", "if", "else", "for", "of", "while", "return", "new", "null", "true", "false", "throw", "continue"]),
  py: new Set(["def", "if", "else", "for", "in", "not", "is", "and", "while", "return", "from", "import", "None", "True", "False", "raise", "continue", "elif"]),
  java: new Set(["static", "void", "int", "if", "else", "for", "while", "return", "new", "boolean", "throw", "long", "record", "continue"]),
};

const COMMENT: Record<Language, string> = { pseudo: "//", js: "//", java: "//", py: "#" };

// A number, a word, a run of spaces, or a run of other characters (punctuation and operators).
const TOKEN = /(\d+)|([A-Za-z_]\w*)|( +)|([^\w\s]+)/g;

/** Plain code → one highlighted ReactNode per line (blank lines at the start and the end are dropped). */
export function highlight(source: string, language: Language): ReactNode[] {
  return source
    .replace(/^\n+|\s+$/g, "")
    .split("\n")
    .map((line, i) => <Fragment key={i}>{highlightLine(line, language)}</Fragment>);
}

function highlightLine(line: string, language: Language): ReactNode[] {
  // A comment runs to the end of the line.
  const at = line.indexOf(COMMENT[language]);
  const code = at === -1 ? line : line.slice(0, at);
  const tokens = [...code.matchAll(TOKEN)];

  const parts: ReactNode[] = tokens.map((match, k) => {
    const [text, number, word] = match;
    if (number) return <N key={k}>{text}</N>;
    if (word) {
      if (KEYWORDS[language].has(word)) return <K key={k}>{text}</K>;
      // A word followed by "(" is a function call or definition.
      if (tokens[k + 1]?.[0].startsWith("(")) return <F key={k}>{text}</F>;
      return text;
    }
    if (text.trim() === "") return text;
    return <P key={k}>{text}</P>;
  });

  if (at !== -1) parts.push(<C key="comment">{line.slice(at)}</C>);
  return parts;
}
