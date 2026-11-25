import type { Task } from "@/core/types";
import type { GraphEvent, GraphInput, GraphState } from "./types";

/** A task of a graph algorithm. */
export type GraphTask = Task<GraphInput, GraphState, GraphEvent>;
