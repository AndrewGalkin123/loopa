import type { ReactNode } from "react";
import { C, F, K, N, P } from "@/components/code/tokens";

/* Code sample of the "10 / Code Blocks" section (from design/Design System.html). */

export const CODE_SAMPLE: ReactNode[] = [
  <><K>function</K> <F>bubbleSort</F><P>{"(arr) {"}</P></>,
  <>{"  "}<K>const</K> n <P>=</P> arr.length<P>;</P></>,
  <>{"  "}<K>for</K> <P>(</P><K>let</K> i <P>=</P> <N>0</N><P>;</P> i <P>{"<"}</P> n <P>-</P> <N>1</N><P>;</P> i<P>{"++) {"}</P></>,
  <>{"    "}<K>for</K> <P>(</P><K>let</K> j <P>=</P> <N>0</N><P>;</P> j <P>{"<"}</P> n <P>-</P> i <P>-</P> <N>1</N><P>;</P> j<P>{"++) {"}</P></>,
  <>{"      "}<K>if</K> <P>(</P>arr<P>[</P>j<P>{"] >"}</P> arr<P>[</P>j <P>+</P> <N>1</N><P>{"]) {"}</P>{"  "}<C>{"// step 07"}</C></>,
  <>{"        "}<P>[</P>arr<P>[</P>j<P>],</P> arr<P>[</P>j <P>+</P> <N>1</N><P>]] =</P> <P>[</P>arr<P>[</P>j <P>+</P> <N>1</N><P>],</P> arr<P>[</P>j<P>]];</P></>,
  <>{"      "}<P>{"}"}</P></>,
  <>{"    "}<P>{"}"}</P></>,
  <>{"  "}<P>{"}"}</P></>,
  <>{"  "}<K>return</K> arr<P>;</P></>,
  <><P>{"}"}</P></>,
];
