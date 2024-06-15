import { reactive, toRaw } from "vue";
import * as vNG from "v-network-graph";
import { Layout, Node, Edge as vdaEdge } from "@/types/Layout";
import { ExtendedNodes } from "@/types/ExtendedNode";
import {
  VisualizationLayout,
  VisualizationLayouts,
} from "@/types/VisualizationLayout";
import { Lif } from "@/types/Lif";
import { ExtendedEdges } from "@/types/ExtendedEdge";

export class LayoutController {
  public lif = reactive<Lif>({
    metaInformation: {
      projectIdentification: "",
      creator: "",
      exportTimestamp: "",
      lifVersion: "1.0.0",
    },
    layouts: [],
  });

  public vdaLayouts = reactive<Layout[]>([]);
  public visualizationLayouts = reactive<VisualizationLayouts>({});
  public nodes = reactive<ExtendedNodes>({});
  public layouts = reactive<vNG.Layouts>({ nodes: {} });
  public edges = reactive<ExtendedEdges>({});
  private oldLayoutId = "";
  constructor() {
    const layout: Layout = {
      layoutId: "entry",
      layoutName: "Entry",
      layoutVersion: "1.0.0",
      layoutLevelId: "1",
      layoutDescription: "",
      nodes: [],
      edges: [],
      stations: [],
    };
    this.vdaLayouts.push(layout);
  }

  deleteEdge(edgeId: string) {
    if (edgeId && this.edges[edgeId]) {
      delete this.edges[edgeId];
    } else {
      // TODO : add toaster error
    }
  }

  deleteNode(nodeId: string) {
    if (nodeId && this.layouts.nodes[nodeId] && this.nodes[nodeId]) {
      delete this.nodes[nodeId];
      delete this.layouts.nodes[nodeId];
      Object.keys(this.edges).map((edge) => {
        if (
          this.edges[edge].source == nodeId ||
          this.edges[edge].target == nodeId
        ) {
          delete this.edges[edge];
        }
      });
    } else {
      // TODO : add toaster error
    }
  }

  disableNodesDrag() {
    Object.keys(toRaw(this.nodes)).map((key: string) => {
      this.nodes[key].draggable = false;
    });
  }

  changeLayout(layoutId: string) {
    // Save old layout information to visualization layout
    if (this.oldLayoutId != "") {
      this.visualizationLayouts[this.oldLayoutId] = {
        nodes: JSON.parse(JSON.stringify(this.nodes)),
        edges: JSON.parse(JSON.stringify(this.edges)),
        layouts: JSON.parse(JSON.stringify(this.layouts)),
      };
    }

    // Remove all nodes and edges for new layout
    Object.keys(this.nodes).map((node) => {
      delete this.nodes[node];
    });
    Object.keys(this.edges).map((edge) => {
      delete this.edges[edge];
    });
    Object.keys(this.layouts.nodes).map((node) => {
      delete this.layouts.nodes[node];
    });

    // Check if layout exists
    // If exists, load layout data to vue ref variables
    if (this.visualizationLayouts[layoutId]) {
      Object.keys(this.visualizationLayouts[layoutId].nodes).map((node) => {
        this.nodes[node] = JSON.parse(
          JSON.stringify(this.visualizationLayouts[layoutId].nodes[node])
        );
      });
      Object.keys(this.visualizationLayouts[layoutId].edges).map((edge) => {
        this.edges[edge] = JSON.parse(
          JSON.stringify(this.visualizationLayouts[layoutId].edges[edge])
        );
      });
      Object.keys(this.visualizationLayouts[layoutId].layouts.nodes).map(
        (node) => {
          this.layouts.nodes[node] = JSON.parse(
            JSON.stringify(
              this.visualizationLayouts[layoutId].layouts.nodes[node]
            )
          );
        }
      );
    }
    this.oldLayoutId = layoutId;
  }

  createNode(node: Node) {
    this.nodes[node.nodeId] = JSON.parse(
      JSON.stringify({
        name: node.nodeName,
        draggable: false,
        vda5050: node,
      })
    );
    const nodeX = this.layouts.nodes[node.nodeId]
      ? this.layouts.nodes[node.nodeId].x
      : node.nodePosition.x;
    const nodeY = this.layouts.nodes[node.nodeId]
      ? this.layouts.nodes[node.nodeId].y
      : node.nodePosition.y;
    this.layouts.nodes[node.nodeId] = {
      x: Math.floor(nodeX * 1000) / 1000,
      y: Math.floor(nodeY * 1000) / 1000,
    };
    // Update node position in vda layout
    this.nodes[node.nodeId].vda5050.nodePosition =
      this.layouts.nodes[node.nodeId];
  }

  updateEdges(source: string, targets: string[]) {
    Object.keys(this.edges).forEach((key) => {
      if (this.edges[key].vng.source == source) {
        delete this.edges[key];
      }
    });

    targets.forEach((target) => {
      this.createEdge(source, target);
    });
  }

  createEdge(source: string, target: string) {
    const vdaEdge: vdaEdge = {
      edgeId: source + "_" + target,
      edgeName: source + "_" + target,
      startNodeId: source,
      endNodeId: target,
      edgeDescription: "",
      vehicleTypeEdge: [],
    };
    this.edges[source + "_" + target] = {
      vda5050: vdaEdge,
      source: source,
      target: target,
    };
  }

  saveLayout(layout: Layout) {
    const layoutIndex = this.vdaLayouts.findIndex(
      (t_layout) => t_layout.layoutId === layout.layoutId
    );
    if (layoutIndex !== -1) {
      this.vdaLayouts[layoutIndex] = layout;
    } else {
      this.vdaLayouts.push(layout);
    }
  }
  deleteLayout(layoutId: string) {
    this.vdaLayouts.splice(
      this.vdaLayouts.findIndex((t_layout) => t_layout.layoutId === layoutId),
      1
    );
  }

  convertLifToJson() {
    this.changeLayout(this.oldLayoutId);
    this.vdaLayouts.forEach((layout) => {
      const visualizationLayout = this.visualizationLayouts[layout.layoutId];
      if (visualizationLayout && visualizationLayout.nodes) {
        layout.nodes = Object.values(visualizationLayout.nodes).map(
          (node) => node.vda5050
        );
        if (visualizationLayout.edges) {
          layout.edges = Object.keys(visualizationLayout.edges).map(
            (edgeId) => {
              return visualizationLayout.edges[edgeId].vda5050;
            }
          );
        }
      }
    });
    this.lif.layouts = this.vdaLayouts;
  }
  convertJsonToLif(data: string) {
    let vdaLayouts: Lif;
    try {
      vdaLayouts = JSON.parse(data);
    } catch {
      return;
    }
    // Set lif meta information
    this.lif.metaInformation = vdaLayouts.metaInformation;

    // Reset old layout
    this.vdaLayouts = vdaLayouts.layouts;
    this.oldLayoutId = "";

    // Convert Json to VisualizationLayout
    this.vdaLayouts.forEach((layout) => {
      const visualizationLayout: VisualizationLayout = {
        nodes: {},
        edges: {},
        layouts: { nodes: {} },
      };

      layout.nodes.forEach((node) => {
        visualizationLayout.nodes[node.nodeId] = {
          vda5050: node,
          draggable: false,
          name: node.nodeName,
        };
        visualizationLayout.layouts.nodes[node.nodeId] = {
          x: node.nodePosition.x,
          y: node.nodePosition.y,
        };
      });
      layout.edges.forEach((edge) => {
        visualizationLayout.edges[edge.edgeId] = {
          source: edge.startNodeId,
          target: edge.endNodeId,
        };
      });
      this.visualizationLayouts[layout.layoutId] = visualizationLayout;
    });

    // After open the layout, show the first layout
    this.changeLayout(this.vdaLayouts[0].layoutId);
  }
}
