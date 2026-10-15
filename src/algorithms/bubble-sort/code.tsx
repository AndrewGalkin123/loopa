import type { ReactNode } from "react";
import { codeLines, F, K, N, P } from "@/components/code/tokens";

/* Highlighted pseudocode and implementations of Bubble Sort (from design/Bubble Sort.html). */

export const PSEUDOCODE: ReactNode[] = codeLines([
  <><K>procedure</K> <F>bubbleSort</F><P>(A : list)</P></>,
  <>{"  "}n <P>←</P> length<P>(</P>A<P>)</P></>,
  <>{"  "}<K>repeat</K></>,
  <>{"    "}swapped <P>←</P> <K>false</K></>,
  <>{"    "}<K>for</K> i <P>←</P> <N>1</N> <K>to</K> n<P>-</P><N>1</N> <K>do</K></>,
  <>{"      "}<K>if</K> A<P>[</P>i<P>-</P><N>1</N><P>{"] >"}</P> A<P>[</P>i<P>]</P> <K>then</K></>,
  <>{"        "}<F>swap</F><P>(</P>A<P>[</P>i<P>-</P><N>1</N><P>],</P> A<P>[</P>i<P>])</P></>,
  <>{"        "}swapped <P>←</P> <K>true</K></>,
  <>{"    "}n <P>←</P> n<P>-</P><N>1</N></>,
  <>{"  "}<K>until</K> <K>not</K> swapped</>,
]);

const JS: ReactNode[] = codeLines([
  <><K>function</K> <F>bubbleSort</F><P>{"(arr) {"}</P></>,
  <>{"  "}<K>let</K> n <P>=</P> arr<P>.</P>length<P>;</P></>,
  <>{"  "}<K>let</K> swapped<P>;</P></>,
  <>{"  "}<K>do</K> <P>{"{"}</P></>,
  <>{"    "}swapped <P>=</P> <K>false</K><P>;</P></>,
  <>{"    "}<K>for</K> <P>(</P><K>let</K> i <P>=</P> <N>1</N><P>;</P> i <P>{"<"}</P> n<P>;</P> i<P>{"++) {"}</P></>,
  <>{"      "}<K>if</K> <P>(</P>arr<P>[</P>i <P>-</P> <N>1</N><P>{"] >"}</P> arr<P>[</P>i<P>{"]) {"}</P></>,
  <>{"        "}<P>[</P>arr<P>[</P>i<P>-</P><N>1</N><P>],</P> arr<P>[</P>i<P>]] = [</P>arr<P>[</P>i<P>],</P> arr<P>[</P>i<P>-</P><N>1</N><P>]];</P></>,
  <>{"        "}swapped <P>=</P> <K>true</K><P>;</P></>,
  <>{"      "}<P>{"}"}</P></>,
  <>{"    "}<P>{"}"}</P></>,
  <>{"    "}n<P>--;</P></>,
  <>{"  "}<P>{"}"}</P> <K>while</K> <P>(</P>swapped<P>);</P></>,
  <>{"  "}<K>return</K> arr<P>;</P></>,
  <><P>{"}"}</P></>,
]);

const PYTHON: ReactNode[] = codeLines([
  <><K>def</K> <F>bubble_sort</F><P>(</P>arr<P>):</P></>,
  <>{"    "}n <P>=</P> <F>len</F><P>(</P>arr<P>)</P></>,
  <>{"    "}<K>while</K> <K>True</K><P>:</P></>,
  <>{"        "}swapped <P>=</P> <K>False</K></>,
  <>{"        "}<K>for</K> i <K>in</K> <F>range</F><P>(</P><N>1</N><P>,</P> n<P>):</P></>,
  <>{"            "}<K>if</K> arr<P>[</P>i <P>-</P> <N>1</N><P>{"] >"}</P> arr<P>[</P>i<P>]:</P></>,
  <>{"                "}arr<P>[</P>i<P>-</P><N>1</N><P>],</P> arr<P>[</P>i<P>] =</P> arr<P>[</P>i<P>],</P> arr<P>[</P>i<P>-</P><N>1</N><P>]</P></>,
  <>{"                "}swapped <P>=</P> <K>True</K></>,
  <>{"        "}n <P>-=</P> <N>1</N></>,
  <>{"        "}<K>if</K> <K>not</K> swapped<P>:</P></>,
  <>{"            "}<K>break</K></>,
  <>{"    "}<K>return</K> arr</>,
]);

const JAVA: ReactNode[] = codeLines([
  <><K>static</K> <K>void</K> <F>bubbleSort</F><P>(</P><K>int</K><P>[]</P> arr<P>{") {"}</P></>,
  <>{"  "}<K>int</K> n <P>=</P> arr<P>.</P>length<P>;</P></>,
  <>{"  "}<K>boolean</K> swapped<P>;</P></>,
  <>{"  "}<K>do</K> <P>{"{"}</P></>,
  <>{"    "}swapped <P>=</P> <K>false</K><P>;</P></>,
  <>{"    "}<K>for</K> <P>(</P><K>int</K> i <P>=</P> <N>1</N><P>;</P> i <P>{"<"}</P> n<P>;</P> i<P>{"++) {"}</P></>,
  <>{"      "}<K>if</K> <P>(</P>arr<P>[</P>i<P>-</P><N>1</N><P>{"] >"}</P> arr<P>[</P>i<P>{"]) {"}</P></>,
  <>{"        "}<K>int</K> t <P>=</P> arr<P>[</P>i<P>-</P><N>1</N><P>];</P></>,
  <>{"        "}arr<P>[</P>i<P>-</P><N>1</N><P>] =</P> arr<P>[</P>i<P>];</P> arr<P>[</P>i<P>] =</P> t<P>;</P></>,
  <>{"        "}swapped <P>=</P> <K>true</K><P>;</P></>,
  <>{"      "}<P>{"}"}</P></>,
  <>{"    "}<P>{"}"}</P></>,
  <>{"    "}n<P>--;</P></>,
  <>{"  "}<P>{"}"}</P> <K>while</K> <P>(</P>swapped<P>);</P></>,
  <><P>{"}"}</P></>,
]);

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: JS },
  { id: "py", label: "Python", lines: PYTHON },
  { id: "java", label: "Java", lines: JAVA },
];
