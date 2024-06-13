import { Node } from "./Layout";

export interface ExtendedNode{
    vda5050: Node;
    draggable: boolean,
    name: string;
}

export type ExtendedNodes = Record<string, ExtendedNode>;
