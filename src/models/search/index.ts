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
    default: { color: "var(--viz-default)", desc: "ještě možné" },
    compared: { color: "var(--viz-compared)", desc: "právě zkoumaný" },
    sorted: { color: "var(--viz-sorted)", desc: "nalezeno" },
    dimmed: { color: "var(--viz-default)", desc: "vyřazeno", dim: true },
    target: { color: "var(--viz-target)", desc: "hledaná hodnota" },
  },
};
