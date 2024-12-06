import {Edge as vngEdge} from 'v-network-graph';
import {Edge as vdaEdge} from './layout';

export interface ExtendedEdge extends vngEdge {
  vda5050Edge: vdaEdge;
}

export type ExtendedEdges = Record<string, ExtendedEdge>;
