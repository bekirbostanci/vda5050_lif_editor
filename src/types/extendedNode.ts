import { Node, Station } from "./layout";
import { Node as vngNode } from "v-network-graph";

export type NodeType = "vda5050Node" | "vda5050Station";
export interface ExtendedNode extends vngNode {
  vda5050Node?: Node;
  vda5050Station?: Station;
  type: NodeType;
  color: string;
}

export type ExtendedNodes = Record<string, ExtendedNode>;
