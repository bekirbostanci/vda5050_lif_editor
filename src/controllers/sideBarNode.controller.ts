import { ref, toRaw } from "vue";
import { LayoutController } from "./layout.controller";
import { ToolController } from "./tool.controller";
import { Node } from "@/types/Layout";

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

  constructor(
    public toolController: ToolController,
    public layoutController: LayoutController
  ) {}

  cleanNode() {
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
    console.log(selectedNode,toRaw(this.layoutController.nodes[selectedNode]));

    this.layoutController.resetAllDrag();
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
