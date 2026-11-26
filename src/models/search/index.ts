import type { Model } from "@/core/types";
import { SearchDataMenu } from "./SearchDataMenu";
import { SearchInputPanel } from "./SearchInputPanel";
import { SearchView } from "./SearchView";

/** The search model: bars with the wanted value in the player, target and array in the side panel. */
export const searchModel: Model = {
  View: SearchView,
  InputPanel: SearchInputPanel,
  DataMenu: SearchDataMenu,
  legend: {
    default: { color: "var(--viz-default)", desc: { cs: "ještě možné", en: "still possible" } },
    compared: { color: "var(--viz-compared)", desc: { cs: "právě zkoumaný", en: "being checked" } },
    sorted: { color: "var(--viz-sorted)", desc: { cs: "nalezeno", en: "found" } },
    dimmed: { color: "var(--viz-default)", desc: { cs: "vyřazeno", en: "ruled out" }, dim: true },
    target: { color: "var(--viz-target)", desc: { cs: "hledaná hodnota", en: "the wanted value" } },
  },
};
