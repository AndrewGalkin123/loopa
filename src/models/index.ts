import type { Model, ModelId } from "@/core/types";
import { arrayModel } from "./array";
import { graphModel } from "./graph";
import { searchModel } from "./search";

/** All data models, by the name used in AlgorithmDefinition.model. */
export const MODELS: Record<ModelId, Model> = {
  array: arrayModel,
  graph: graphModel,
  search: searchModel,
};
