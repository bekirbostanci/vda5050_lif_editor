import { reactive, toRaw } from "vue";
import * as vNG from "v-network-graph";
import { Layout, Node } from "@/types/Layout";
import { ExtendedNodes } from "@/types/ExtendedNode";

export class LayoutController {
  public vdaLayouts = reactive<Layout[]>([]);
  public visualizationLayouts = reactive([]);
  public nodes = reactive<ExtendedNodes>({
    // node1: {
    //   name: "Node 1",
    //   draggable: false,
    //   vda5050: {
    //     mapId: "",
    //     nodeDescription: "",
    //     nodeId: "node1",
    //     nodeName: "Node 1",
    //     nodePosition: { x: 0, y: 0 },
    //     vehicleTypeNodeProperties: [],
    //   },
    // },
    // node2: {
    //   name: "Node 2",
    //   draggable: false,
    //   vda5050: {
    //     mapId: "",
    //     nodeDescription: "",
    //     nodeId: "node2",
    //     nodeName: "Node 2",
    //     nodePosition: { x: 1, y: 0 },
    //     vehicleTypeNodeProperties: [],
    //   },
    // },
    // node3: {
    //   name: "Node 3",
    //   draggable: false,
    //   vda5050: {
    //     mapId: "",
    //     nodeDescription: "",
    //     nodeId: "node3",
    //     nodeName: "Node 3",
    //     nodePosition: { x: 2, y: 0 },
    //     vehicleTypeNodeProperties: [],
    //   },
    // },
    // node4: {
    //   name: "Node 4",
    //   draggable: false,
    //   vda5050: {
    //     mapId: "",
    //     nodeDescription: "",
    //     nodeId: "node4",
    //     nodeName: "Node 4",
    //     nodePosition: { x: 3, y: 0 },
    //     vehicleTypeNodeProperties: [],
    //   },
    // },
  });

  public layouts = reactive<vNG.Layouts>({
    nodes: {
      // node1: { x: 0.0, y: 0.0 },
      // node2: { x: 1.0, y: 0.0 },
      // node3: { x: 1.0, y: 1.0 },
      // node4: { x: 0.0, y: 1.0 },
    },
  });

  public edges = reactive<vNG.Edges>({
    // edge1: { source: "node1", target: "node2" },
    // edge2: { source: "node2", target: "node3" },
    // edge3: { source: "node3", target: "node4" },
  });
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

  resetAllDrag() {
    Object.keys(toRaw(this.nodes)).map((key: string) => {
      this.nodes[key].draggable = false;
    });
  }

  createNode(node: Node) {
    console.log("createNode", node);
    
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
      x: nodeX,
      y: nodeY,
    };
  }

  updateEdges(source: string, targets: string[]) {
    /* 
    First remove all same source edges from edges object
    */
    Object.keys(this.edges).forEach((key) => {
      if (this.edges[key].source == source) {
        delete this.edges[key];
      }
    });
    /* 
    Then add new edges
    */

    targets.forEach((target) => {
      this.createEdge(source, target);
    });
  }

  createEdge(source: string, target: string) {
    this.edges[source + "_" + target] = { source: source, target: target };
  }
}
