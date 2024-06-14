import { reactive, toRaw } from "vue";
import * as vNG from "v-network-graph";
import { Edge, Layout, Node } from "@/types/Layout";
import { ExtendedNodes } from "@/types/ExtendedNode";
import { VisualizationLayouts } from "@/types/VisualizationLayout";
import { Lif } from "@/types/Lif";

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
  public edges = reactive<vNG.Edges>({});
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

    const layout1: Layout = {
      layoutId: "entry1",
      layoutName: "Entry1",
      layoutVersion: "1.0.0",
      layoutLevelId: "1",
      layoutDescription: "",
      nodes: [],
      edges: [],
      stations: [],
    };
    this.vdaLayouts.push(layout1);
  }

  deleteNode(nodeId: string) {
    delete this.nodes[nodeId];
    delete this.layouts.nodes[nodeId];
  }

  disableNodesDrag() {
    Object.keys(toRaw(this.nodes)).map((key: string) => {
      this.nodes[key].draggable = false;
    });
  }

  changeLayout(layoutId: string) {
    if (this.oldLayoutId != "") {
      this.visualizationLayouts[this.oldLayoutId] = {
        nodes: JSON.parse(JSON.stringify(this.nodes)),
        edges: JSON.parse(JSON.stringify(this.edges)),
        layouts: JSON.parse(JSON.stringify(this.layouts)),
      };
    }
    Object.keys(this.nodes).map((node) => {
      delete this.nodes[node];
    });
    Object.keys(this.edges).map((edge) => {
      delete this.edges[edge];
    });
    Object.keys(this.layouts.nodes).map((node) => {
      delete this.layouts.nodes[node];
    });

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
    this.edges[source + "_" + target] = { source: source, target: target };
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

  convertToLif() {
    this.changeLayout(this.oldLayoutId);
    this.vdaLayouts.map((layout) => {
      let visLayout = this.visualizationLayouts[layout.layoutId];
      if (visLayout && visLayout.nodes) {
        layout.nodes = Object.keys(visLayout.nodes).map((item) =>
          toRaw(visLayout.nodes[item].vda5050)
        );
        if (visLayout && visLayout.edges) {
          layout.edges = Object.keys(visLayout.edges).map((item) =>
            {
              const graphEdge = visLayout.edges[item];
              let edge: Edge = {
                edgeId: item,
                edgeName: item,
                edgeDescription: "",
                startNodeId: graphEdge.source,
                endNodeId: graphEdge.target,
                vehicleTypeEdge: [],
              };
              return edge
             
            }
          );
        }
      }
    });
    // Object.keys(this.visualizationLayouts).map((key) => {
    //   console.log("key ", key);
    //   console.log(
    //     Object.keys(this.visualizationLayouts[key].nodes).map((item) =>
    //       toRaw(this.visualizationLayouts[key].nodes[item].vda5050)
    //     )
    //   );
    // });
    this.lif.layouts = this.vdaLayouts;
  }
}
