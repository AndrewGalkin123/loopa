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
    default: { color: "var(--viz-default)", desc: { cs: "nenalezený", en: "not found yet" } },
    frontier: { color: "var(--viz-frontier)", desc: { cs: "čeká", en: "waiting" } },
    active: { color: "var(--viz-active)", desc: { cs: "právě zpracovávaný", en: "being processed" } },
    compared: { color: "var(--viz-compared)", desc: { cs: "kontrolovaný soused", en: "neighbour being checked" } },
    done: { color: "var(--viz-done)", desc: { cs: "hotovo", en: "done" } },
  },
};
