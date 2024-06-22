import * as vNG from "v-network-graph";
import { ExtendedNodes } from "@/types/extendedNode";
export interface VisualizationLayout {
  nodes: ExtendedNodes;
  edges: vNG.Edges;
  layouts: vNG.Layouts;
}
export type VisualizationLayouts = Record<string, VisualizationLayout>;
