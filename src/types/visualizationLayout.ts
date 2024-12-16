import * as vNG from 'v-network-graph';
import {ExtendedNodes} from '@/types/extendedNode';
export interface VisualizationLayout {
  nodes: ExtendedNodes;
  edges: vNG.Edges;
  layouts: vNG.Layouts;
  backgroundImage?: BackgroundImage;
}

export interface MapMetadata {
  resolution: number;
  origin: [number, number];
}

export interface BackgroundImage {
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}
export type VisualizationLayouts = Record<string, VisualizationLayout>;
