import { Ref, ref, toRaw } from "vue";
import { LayoutController } from "./layout.controller";
import { SideBarController } from "./sideBar.controller";
import { Node } from "@/types/Layout";
import { ViewEvent } from "v-network-graph";

export class SideBarNodeController {
  public newNode = ref<Node>({
    mapId: "",
    nodeDescription: "",
    nodeId: "",
    nodeName: "",
    nodePosition: {
      x: 0,
      y: 0,
    },
    vehicleTypeNodeProperties: [],
  });
  public nodeConnections = ref<string[]>([]);
  public createFast: Ref<boolean> = ref<boolean>(true);
  private lastNodeId: string = "";
  constructor(
    public toolController: SideBarController,
    public layoutController: LayoutController,
    public graph: any
  ) {}

  createNodeFast(mouseEvent: ViewEvent<MouseEvent>) {
    if (this.graph.value && this.createFast.value == true) {
      const point = {
        x: mouseEvent.event.offsetX,
        y: mouseEvent.event.offsetY,
      };
      const svgPoint = this.graph.value.translateFromDomToSvgCoordinates(point);
      const newNodeId = Date.now().toString();

      if (this.toolController.selectedNodes.value.length > 0) {
        this.lastNodeId = this.toolController.selectedNodes.value[0];
        this.layoutController.createEdge(this.lastNodeId, newNodeId);
      } else if (this.layoutController.nodes[this.lastNodeId]) {
        this.layoutController.createEdge(this.lastNodeId, newNodeId);
      }

      this.layoutController.createNode({
        nodeId: newNodeId,
        nodeName: newNodeId,
        vehicleTypeNodeProperties: [],
        nodeDescription: this.newNode.value.nodeDescription,
        mapId: this.newNode.value.mapId,
        nodePosition: {
          x: svgPoint.x,
          y: svgPoint.y,
        },
      });
      this.lastNodeId = newNodeId;
    }
  }

  cleanNodeInputs() {
    this.newNode.value.nodePosition.x = 0;
    this.newNode.value.nodePosition.y = 0;
    this.nodeConnections.value = [];
    this.newNode.value = {
      mapId: "",
      nodeDescription: "",
      nodeId: "",
      nodeName: "",
      nodePosition: {
        x: 0,
        y: 0,
      },
      vehicleTypeNodeProperties: [],
    };
  }

  updateNode(selectedNode: string) {
    this.layoutController.disableNodesDrag();
    if (selectedNode) {
      this.layoutController.nodes[selectedNode].draggable = true;
    }

    this.newNode.value.mapId =
      this.layoutController.nodes[selectedNode].vda5050.mapId;
    this.newNode.value.nodeDescription =
      this.layoutController.nodes[selectedNode].vda5050.nodeDescription;
    this.newNode.value.nodeId =
      this.layoutController.nodes[selectedNode].vda5050.nodeId;
    this.newNode.value.nodeName =
      this.layoutController.nodes[selectedNode].vda5050.nodeName;

    const test = Object.values(this.layoutController.edges).filter(
      (connection) => connection.source == selectedNode
    );
    this.nodeConnections.value = Object.values(toRaw(test)).map(
      (node) => node.target
    );
  }
}
