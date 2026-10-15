import type { ReactNode } from "react";
import { codeLines, F, K, N, P } from "@/components/code/tokens";

/* Highlighted pseudocode and implementations of Quick Sort (Lomuto partition, pivot = last element). */

export const PSEUDOCODE: ReactNode[] = codeLines([
  <><K>procedure</K> <F>quickSort</F><P>(</P>A<P>,</P> lo<P>,</P> hi<P>)</P></>,
  <>{"  "}<K>if</K> lo <P>{"<"}</P> hi <K>then</K></>,
  <>{"    "}p <P>←</P> <F>partition</F><P>(</P>A<P>,</P> lo<P>,</P> hi<P>)</P></>,
  <>{"    "}<F>quickSort</F><P>(</P>A<P>,</P> lo<P>,</P> p<P>-</P><N>1</N><P>)</P></>,
  <>{"    "}<F>quickSort</F><P>(</P>A<P>,</P> p<P>+</P><N>1</N><P>,</P> hi<P>)</P></>,
  <></>,
  <><K>procedure</K> <F>partition</F><P>(</P>A<P>,</P> lo<P>,</P> hi<P>)</P></>,
  <>{"  "}pivot <P>←</P> A<P>[</P>hi<P>]</P></>,
  <>{"  "}i <P>←</P> lo <P>-</P> <N>1</N></>,
  <>{"  "}<K>for</K> j <P>←</P> lo <K>to</K> hi<P>-</P><N>1</N> <K>do</K></>,
  <>{"    "}<K>if</K> A<P>[</P>j<P>]</P> <P>≤</P> pivot <K>then</K></>,
  <>{"      "}i <P>←</P> i <P>+</P> <N>1</N></>,
  <>{"      "}<F>swap</F><P>(</P>A<P>[</P>i<P>],</P> A<P>[</P>j<P>])</P></>,
  <>{"  "}<F>swap</F><P>(</P>A<P>[</P>i<P>+</P><N>1</N><P>],</P> A<P>[</P>hi<P>])</P></>,
  <>{"  "}<K>return</K> i <P>+</P> <N>1</N></>,
]);

const JS: ReactNode[] = codeLines([
  <><K>function</K> <F>quickSort</F><P>(</P>arr<P>,</P> lo <P>=</P> <N>0</N><P>,</P> hi <P>=</P> arr<P>.</P>length <P>-</P> <N>1</N><P>)</P> <P>{"{"}</P></>,
  <>{"  "}<K>if</K> <P>(</P>lo <P>{"<"}</P> hi<P>)</P> <P>{"{"}</P></>,
  <>{"    "}<K>const</K> p <P>=</P> <F>partition</F><P>(</P>arr<P>,</P> lo<P>,</P> hi<P>);</P></>,
  <>{"    "}<F>quickSort</F><P>(</P>arr<P>,</P> lo<P>,</P> p <P>-</P> <N>1</N><P>);</P></>,
  <>{"    "}<F>quickSort</F><P>(</P>arr<P>,</P> p <P>+</P> <N>1</N><P>,</P> hi<P>);</P></>,
  <>{"  "}<P>{"}"}</P></>,
  <>{"  "}<K>return</K> arr<P>;</P></>,
  <><P>{"}"}</P></>,
  <></>,
  <><K>function</K> <F>partition</F><P>(</P>arr<P>,</P> lo<P>,</P> hi<P>)</P> <P>{"{"}</P></>,
  <>{"  "}<K>const</K> pivot <P>=</P> arr<P>[</P>hi<P>];</P></>,
  <>{"  "}<K>let</K> i <P>=</P> lo <P>-</P> <N>1</N><P>;</P></>,
  <>{"  "}<K>for</K> <P>(</P><K>let</K> j <P>=</P> lo<P>;</P> j <P>{"<"}</P> hi<P>;</P> j<P>++)</P> <P>{"{"}</P></>,
  <>{"    "}<K>if</K> <P>(</P>arr<P>[</P>j<P>]</P> <P>{"<="}</P> pivot<P>)</P> <P>{"{"}</P></>,
  <>{"      "}i<P>++;</P></>,
  <>{"      "}<P>[</P>arr<P>[</P>i<P>],</P> arr<P>[</P>j<P>]]</P> <P>=</P> <P>[</P>arr<P>[</P>j<P>],</P> arr<P>[</P>i<P>]];</P></>,
  <>{"    "}<P>{"}"}</P></>,
  <>{"  "}<P>{"}"}</P></>,
  <>{"  "}<P>[</P>arr<P>[</P>i <P>+</P> <N>1</N><P>],</P> arr<P>[</P>hi<P>]]</P> <P>=</P> <P>[</P>arr<P>[</P>hi<P>],</P> arr<P>[</P>i <P>+</P> <N>1</N><P>]];</P></>,
  <>{"  "}<K>return</K> i <P>+</P> <N>1</N><P>;</P></>,
  <><P>{"}"}</P></>,
]);

const PYTHON: ReactNode[] = codeLines([
  <><K>def</K> <F>quick_sort</F><P>(</P>arr<P>,</P> lo<P>=</P><N>0</N><P>,</P> hi<P>=</P><K>None</K><P>):</P></>,
  <>{"    "}<K>if</K> hi <K>is</K> <K>None</K><P>:</P></>,
  <>{"        "}hi <P>=</P> <F>len</F><P>(</P>arr<P>)</P> <P>-</P> <N>1</N></>,
  <>{"    "}<K>if</K> lo <P>{"<"}</P> hi<P>:</P></>,
  <>{"        "}p <P>=</P> <F>partition</F><P>(</P>arr<P>,</P> lo<P>,</P> hi<P>)</P></>,
  <>{"        "}<F>quick_sort</F><P>(</P>arr<P>,</P> lo<P>,</P> p <P>-</P> <N>1</N><P>)</P></>,
  <>{"        "}<F>quick_sort</F><P>(</P>arr<P>,</P> p <P>+</P> <N>1</N><P>,</P> hi<P>)</P></>,
  <>{"    "}<K>return</K> arr</>,
  <></>,
  <><K>def</K> <F>partition</F><P>(</P>arr<P>,</P> lo<P>,</P> hi<P>):</P></>,
  <>{"    "}pivot <P>=</P> arr<P>[</P>hi<P>]</P></>,
  <>{"    "}i <P>=</P> lo <P>-</P> <N>1</N></>,
  <>{"    "}<K>for</K> j <K>in</K> <F>range</F><P>(</P>lo<P>,</P> hi<P>):</P></>,
  <>{"        "}<K>if</K> arr<P>[</P>j<P>]</P> <P>{"<="}</P> pivot<P>:</P></>,
  <>{"            "}i <P>+=</P> <N>1</N></>,
  <>{"            "}arr<P>[</P>i<P>],</P> arr<P>[</P>j<P>]</P> <P>=</P> arr<P>[</P>j<P>],</P> arr<P>[</P>i<P>]</P></>,
  <>{"    "}arr<P>[</P>i <P>+</P> <N>1</N><P>],</P> arr<P>[</P>hi<P>]</P> <P>=</P> arr<P>[</P>hi<P>],</P> arr<P>[</P>i <P>+</P> <N>1</N><P>]</P></>,
  <>{"    "}<K>return</K> i <P>+</P> <N>1</N></>,
]);

const JAVA: ReactNode[] = codeLines([
  <><K>static</K> <K>void</K> <F>quickSort</F><P>(</P><K>int</K><P>[]</P> arr<P>,</P> <K>int</K> lo<P>,</P> <K>int</K> hi<P>)</P> <P>{"{"}</P></>,
  <>{"  "}<K>if</K> <P>(</P>lo <P>{"<"}</P> hi<P>)</P> <P>{"{"}</P></>,
  <>{"    "}<K>int</K> p <P>=</P> <F>partition</F><P>(</P>arr<P>,</P> lo<P>,</P> hi<P>);</P></>,
  <>{"    "}<F>quickSort</F><P>(</P>arr<P>,</P> lo<P>,</P> p <P>-</P> <N>1</N><P>);</P></>,
  <>{"    "}<F>quickSort</F><P>(</P>arr<P>,</P> p <P>+</P> <N>1</N><P>,</P> hi<P>);</P></>,
  <>{"  "}<P>{"}"}</P></>,
  <><P>{"}"}</P></>,
  <></>,
  <><K>static</K> <K>int</K> <F>partition</F><P>(</P><K>int</K><P>[]</P> arr<P>,</P> <K>int</K> lo<P>,</P> <K>int</K> hi<P>)</P> <P>{"{"}</P></>,
  <>{"  "}<K>int</K> pivot <P>=</P> arr<P>[</P>hi<P>];</P></>,
  <>{"  "}<K>int</K> i <P>=</P> lo <P>-</P> <N>1</N><P>;</P></>,
  <>{"  "}<K>for</K> <P>(</P><K>int</K> j <P>=</P> lo<P>;</P> j <P>{"<"}</P> hi<P>;</P> j<P>++)</P> <P>{"{"}</P></>,
  <>{"    "}<K>if</K> <P>(</P>arr<P>[</P>j<P>]</P> <P>{"<="}</P> pivot<P>)</P> <P>{"{"}</P></>,
  <>{"      "}i<P>++;</P></>,
  <>{"      "}<K>int</K> t <P>=</P> arr<P>[</P>i<P>];</P> arr<P>[</P>i<P>]</P> <P>=</P> arr<P>[</P>j<P>];</P> arr<P>[</P>j<P>]</P> <P>=</P> t<P>;</P></>,
  <>{"    "}<P>{"}"}</P></>,
  <>{"  "}<P>{"}"}</P></>,
  <>{"  "}<K>int</K> t <P>=</P> arr<P>[</P>i <P>+</P> <N>1</N><P>];</P> arr<P>[</P>i <P>+</P> <N>1</N><P>]</P> <P>=</P> arr<P>[</P>hi<P>];</P> arr<P>[</P>hi<P>]</P> <P>=</P> t<P>;</P></>,
  <>{"  "}<K>return</K> i <P>+</P> <N>1</N><P>;</P></>,
  <><P>{"}"}</P></>,
]);

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: JS },
  { id: "py", label: "Python", lines: PYTHON },
  { id: "java", label: "Java", lines: JAVA },
];
