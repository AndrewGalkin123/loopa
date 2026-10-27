import type { Model, ModelId } from "@/core/types";
import { arrayModel } from "./array";

/** All data models, by the name used in AlgorithmDefinition.model. */
export const MODELS: Record<ModelId, Model> = {
  array: arrayModel,
};
