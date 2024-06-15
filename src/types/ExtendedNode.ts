import { Node } from "./Layout";
import { Node as vngNode } from "v-network-graph";


export interface ExtendedNode extends vngNode {
    vda5050: Node;
}

export type ExtendedNodes = Record<string, ExtendedNode>;
