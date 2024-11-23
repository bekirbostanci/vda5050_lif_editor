import { reactive, ref, toRaw } from "vue";
import * as vNG from "v-network-graph";
import { Action, Layout, Node, Station, Edge as vdaEdge } from "@/types/layout";
import { BackgroundImage } from "@/types/visualizationLayout";
import { ExtendedNodes } from "@/types/extendedNode";
import {
  VisualizationLayout,
  VisualizationLayouts,
} from "@/types/visualizationLayout";
import { Lif } from "@/types/lif";
import { ExtendedEdges } from "@/types/extendedEdge";
import { showToast } from "@/utils/general";
import { COLORS } from "@/utils/colors";
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
  public actions = reactive<Action[]>([]);
  public backgroundImage = ref<BackgroundImage>({
    image: "",
    x: 0,
    y: 0,
    width: 10,
    height: 10
  });
  private oldLayoutId = "";
  private graph: any;
  constructor(graph: any) {
    this.graph = graph;
    const layout: Layout = {
      layoutId: "entry",
      layoutName: "Entry",
      layoutVersion: "1.0.0",
      layoutLevelId: "1",
      layoutDescription: "",
      nodes: [],
      edges: [],
      stations: [],
      backgroundImage: {
        image: "",
        x: 0,
        y: 0,
        width: 10,
        height: 10
      }
    };
    this.vdaLayouts.push(layout);
  }

  public isVda5050Node(nodeId: string) {
    return !!this.nodes[nodeId].vda5050Node;
  }

  public isVda5050Station(nodeId: string) {
    return !!this.nodes[nodeId].vda5050Station;
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
        backgroundImage: JSON.parse(JSON.stringify(this.backgroundImage.value))
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
    this.backgroundImage.value = {
      image: "",
      x: 0,
      y: 0,
      width: 10,
      height: 10
    };

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
      this.backgroundImage.value = JSON.parse(
        JSON.stringify(this.visualizationLayouts[layoutId].backgroundImage)
      );
    }
    this.oldLayoutId = layoutId;
    this.graph.value?.fitToContents();
  }

  createAction(action: Action) {
    if (action.actionType == "") return;

    this.actions.push(JSON.parse(JSON.stringify(action)));
  }

  deleteAction(action: Action) {
    const index = this.actions.findIndex(
      (a) => a.actionType === action.actionType
    );
    if (index > -1) {
      this.actions.splice(index, 1);
    } else {
      showToast("Error", "Action does not delete because not found");
    }
  }

  createNode(node: Node) {
    if (node.nodeId == "") {
      showToast("Error", "Node ID cannot be empty");
      return;
    }

    this.nodes[node.nodeId] = JSON.parse(
      JSON.stringify({
        name: node.nodeName,
        color:
          node.vehicleTypeNodeProperties.length > 0
            ? COLORS.completeNode
            : COLORS.incompleteNode,
        draggable: false,
        vda5050Node: node,
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
    this.nodes[node.nodeId].vda5050Node!.nodePosition = {
      x: this.layouts.nodes[node.nodeId].x,
      y: -this.layouts.nodes[node.nodeId].y,
    };
  }

  createStation(station: Station) {
    if (station.stationId == "") {
      showToast("Error", "Station Id cannot be empty");
      return;
    }
    if (station.interactionNodeIds.length == 0) {
      showToast("Error", "Interaction nodes cannot be empty");
      return;
    }

    this.nodes[station.stationId] = JSON.parse(
      JSON.stringify({
        color: COLORS.completeStation,
        name: station.stationName,
        draggable: true,
        vda5050Station: station,
      })
    );

    const nodeX = this.layouts.nodes[station.stationId]
      ? this.layouts.nodes[station.stationId].x
      : station.stationPosition.x;
    const nodeY = this.layouts.nodes[station.stationId]
      ? this.layouts.nodes[station.stationId].y
      : station.stationPosition.y;

    this.layouts.nodes[station.stationId] = {
      x: Math.floor(nodeX * 1000) / 1000,
      y: Math.floor(nodeY * 1000) / 1000,
    };

    this.nodes[station.stationId].vda5050Station!.stationPosition = {
      x: this.layouts.nodes[station.stationId].x,
      y: -this.layouts.nodes[station.stationId].y,
      theta: station.stationPosition.theta,
    };
  }

  updateEdges(source: string, targets: string[]) {
    Object.keys(this.edges).forEach((key) => {
      if (this.edges[key].source == source) {
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
      vehicleTypeEdgeProperties: [],
    };
    this.edges[source + "_" + target] = {
      vda5050Edge: vdaEdge,
      source: source,
      target: target,
      color: COLORS.incompleteEdge,
    };
  }

  saveLayout(layout: Layout) {
    const layoutIndex = this.vdaLayouts.findIndex(
      (t_layout) => t_layout.layoutId === layout.layoutId
    );
    if (layoutIndex !== -1) {
      this.vdaLayouts[layoutIndex] = layout;
    } else {
      this.vdaLayouts.push({
        layoutId: layout.layoutId,
        layoutName: layout.layoutName,
        layoutVersion: layout.layoutVersion,
        layoutLevelId: layout.layoutLevelId,
        layoutDescription: layout.layoutDescription,
        nodes: [],
        edges: [],
        stations: [],
        backgroundImage: layout.backgroundImage
      });
    }
    this.changeLayout(layout.layoutId);
    if (layout.backgroundImage?.image) {
      this.backgroundImage.value = layout.backgroundImage;
    }
  }
  deleteLayout(layoutId: string) {
    this.vdaLayouts.splice(
      this.vdaLayouts.findIndex((t_layout) => t_layout.layoutId === layoutId),
      1
    );
  }

  convertLifToJson(includeBackground: boolean) {
    this.changeLayout(this.oldLayoutId);
    this.vdaLayouts.forEach((layout) => {
      const visualizationLayout = this.visualizationLayouts[layout.layoutId];
      if (visualizationLayout && visualizationLayout.nodes) {
        layout.nodes = [];
        layout.stations = [];
        Object.values(visualizationLayout.nodes).map((node) => {
          if (node.vda5050Node) {
            layout.nodes.push(node.vda5050Node);
          }
          if (node.vda5050Station) {
            layout.stations.push(node.vda5050Station);
          }
        });

        if (visualizationLayout.edges) {
          layout.edges = Object.keys(visualizationLayout.edges).map(
            (edgeId) => {
              return visualizationLayout.edges[edgeId].vda5050Edge;
            }
          );
        }
      }
    });
  
    this.lif.layouts = JSON.parse(JSON.stringify(this.vdaLayouts));

    // Dont include background image if not requested
    if (!includeBackground) {
      this.lif.layouts.map((layout) => {
        delete layout.backgroundImage;
      });
    }
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
      if (layout.nodes) {
        layout.nodes.forEach((node) => {
          visualizationLayout.nodes[node.nodeId] = {
            vda5050Node: node,
            vda5050Station: undefined,
            draggable: false,
            name: node.nodeName,
            color:
              node.vehicleTypeNodeProperties.length > 0
                ? COLORS.completeNode
                : COLORS.incompleteNode,

            type: "vda5050Node",
          };
          visualizationLayout.layouts.nodes[node.nodeId] = {
            x: node.nodePosition.x,
            y: -node.nodePosition.y,
          };
        });
      } else {
        layout.nodes = [];
      }

      if (layout.stations) {
        layout.stations.forEach((station) => {
          visualizationLayout.nodes[station.stationId] = {
            vda5050Node: undefined,
            vda5050Station: station,
            draggable: false,
            name: station.stationName,
            color:
              station.interactionNodeIds.length > 0
                ? COLORS.completeStation
                : COLORS.incompleteStation,
            type: "vda5050Station",
          };
          visualizationLayout.layouts.nodes[station.stationId] = {
            x: station.stationPosition.x,
            y: -station.stationPosition.y,
          };
        });
      } else {
        layout.stations = [];
      }

      if (layout.edges) {
        layout.edges.forEach((edge) => {
          visualizationLayout.edges[edge.edgeId] = {
            source: edge.startNodeId,
            target: edge.endNodeId,
            color:
              edge.vehicleTypeEdgeProperties.length > 0
                ? COLORS.completeEdge
                : COLORS.incompleteEdge,
            vda5050Edge: edge,
          };
        });
      } else {
        layout.edges = [];
      }
      
      if (layout.backgroundImage) {
        visualizationLayout.backgroundImage = layout.backgroundImage;
      }
      this.visualizationLayouts[layout.layoutId] = visualizationLayout;
    });

    // After open the layout, show the first layout
    this.changeLayout(this.vdaLayouts[0].layoutId);
  }
}
