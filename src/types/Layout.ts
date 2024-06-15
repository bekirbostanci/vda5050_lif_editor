import { ActionParameter, BlockingType, Trajectory } from "vda-5050-lib";

export interface Layout {
  layoutId: string; // Unique identifier for this layout
  layoutName: string; // Human-readable name of the layout (e.g., for displaying)
  layoutVersion: string; // Version of the layout, suggested to be an integer as a string
  layoutLevelId: string; // Indicates which level or floor within a building the layout represents
  layoutDescription: string; // Brief description of the layout
  nodes: Node[]; // Collection of all nodes in the layout
  edges: Edge[]; // Collection of all edges in the layout
  stations: Station[]; // Collection of all stations in the layout
}

export interface Node {
  nodeId: string; // Unique identifier of the node across all layouts contained in this LIF file
  nodeName: string; // Name of the node, for visualization purposes
  nodeDescription: string; // Brief description of the node, for visualization or diagnostic purposes
  mapId: string; // Unique identification of the map in which the node or node's position is referenced
  nodePosition: NodePosition; // Geometric location of the node
  vehicleTypeNodeProperties: VehicleTypeNodeProperty[]; // Vehicle type specific properties for this node
}

export interface NodePosition {
  x: number; // X position on the layout in reference to the global origin (in meters)
  y: number; // Y position on the layout in reference to the global origin (in meters)
}

export interface VehicleTypeNodeProperty {
  vehicleTypeId: string;
  theta: number;
  actions: [Action];
}

export interface Action {
  actionType: string;
  actionDescription: string;
  requirementType: RequirementType;
  blockingType: BlockingType;
  actionParameters: ActionParameter[];
}

export type RequirementType = "REQUIRED" | "CONDITIONAL" | "OPTIONAL";

export interface Edge {
  edgeId: string;
  edgeName: string;
  edgeDescription: string;
  startNodeId: string;
  endNodeId: string;
  vehicleTypeEdge: vehicleTypeEdgeProperties[];
}
export interface vehicleTypeEdgeProperties {
  vehicleTypeId: string;
  vehicleOrientation: number;
  orientationType: OrientationType;
  rotationAllowed: boolean;
  rotationAtStartNodeAllowed: RotationType;
  rotationAtEndNodeAllowed: RotationType;
  maxSpeed: number;
  maxRotationSpeed: number;
  minHeight: number;
  maxHeight: number;
  loadRestriction: LoadRestriction;
  actions: [Action];
  trajectory: Trajectory;
  reentryAllowed: boolean;
}

export interface LoadRestriction {
  unloaded: boolean;
  loaded: boolean;
  loadSetNames: [string];
}

export type OrientationType = "GLOBAL" | "TANGENTIAL";
export type RotationType = "NONE" | "CCW" | "CW" | "BOTH";

export interface Station {
  stationId: string;
  interactionNodeIds: [string];
  stationName: string;
  stationDescription: string;
  stationHeight: number;
  stationPosition: {
    x: number;
    y: number;
    theta: number;
  };
}
