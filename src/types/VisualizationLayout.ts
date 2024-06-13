import * as vNG from "v-network-graph";
import { ExtendedNodes } from "@/types/ExtendedNode";
export interface VisualizationLayout {
  nodes: ExtendedNodes;
  edges: vNG.Edges;
  layouts: vNG.Layouts;
}
export type VisualizationLayouts = Record<string, VisualizationLayout>;
