import type { Model } from "@/core/types";
import { GraphDataMenu } from "./GraphDataMenu";
import { GraphInputPanel } from "./GraphInputPanel";
import { GraphView } from "./GraphView";

/** The graph model: an SVG picture in the player, start vertex / random graph in the side panel. */
export const graphModel: Model = {
  View: GraphView,
  InputPanel: GraphInputPanel,
  DataMenu: GraphDataMenu,
  legend: {
    default: { color: "var(--viz-default)", desc: "nenalezený" },
    frontier: { color: "var(--viz-frontier)", desc: "čeká" },
    active: { color: "var(--viz-active)", desc: "právě zpracovávaný" },
    compared: { color: "var(--viz-compared)", desc: "kontrolovaný soused" },
    done: { color: "var(--viz-done)", desc: "hotovo" },
  },
};
