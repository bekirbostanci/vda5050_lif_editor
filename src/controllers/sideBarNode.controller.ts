import {Ref, ref, toRaw} from 'vue';
import {LayoutController} from './layout.controller';
import {SideBarController} from './sideBar.controller';
import {Node} from '@/types/layout';
import {ViewEvent} from 'v-network-graph';

export class SideBarNodeController {
  public newNode = ref<Node>({
    mapId: '',
    nodeDescription: '',
    nodeId: '',
    nodeName: '',
    nodePosition: {
      x: 0,
      y: 0,
    },
    vehicleTypeNodeProperties: [],
  });
  public nodeConnections = ref<string[]>([]);
  public createFast: Ref<boolean> = ref<boolean>(true);
  public createDoubleWay: Ref<boolean> = ref<boolean>(true);
  private lastNodeId: string = '';
  constructor(
    public toolController: SideBarController,
    public layoutController: LayoutController,
    public graph: any,
  ) {}

  updateNodeYFromInput(nodeY: any) {
    // Revert y coordinate when update node coordinate from input
    if (this.layoutController.layouts.nodes[this.newNode.value.nodeId]) {
      this.layoutController.layouts.nodes[this.newNode.value.nodeId].y =
        parseFloat(nodeY) * -1;
    }
    this.updateNodeY(nodeY);
  }

  updateNodeY(nodeY: any) {
    // Revert y coordinate when node position changed
    if (this.layoutController.nodes[this.newNode.value.nodeId]) {
      this.layoutController.nodes[
        this.newNode.value.nodeId
      ].vda5050Node!.nodePosition.y = nodeY * -1;
    }

    this.newNode.value.nodePosition.y = nodeY * -1;
  }

  createNodeFast(mouseEvent: ViewEvent<MouseEvent>) {
    if (this.graph.value && this.createFast.value == true) {
      const point = {
        x: mouseEvent.event.offsetX,
        y: mouseEvent.event.offsetY,
      };
      const svgPoint = this.graph.value.translateFromDomToSvgCoordinates(point);
      const newNodeId = point.x + '_' + point.y;

      if (
        this.toolController.selectedNodes.value.length > 0 &&
        this.layoutController.nodes[this.toolController.selectedNodes.value[0]]
          .vda5050Node
      ) {
        this.lastNodeId = this.toolController.selectedNodes.value[0];
        this.layoutController.createEdge(this.lastNodeId, newNodeId);
      } else if (
        this.layoutController.nodes[this.lastNodeId] &&
        this.layoutController.nodes[this.lastNodeId].vda5050Node
      ) {
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
      if (this.createDoubleWay.value) {
        this.layoutController.createEdge(newNodeId, this.lastNodeId);
      }
      this.lastNodeId = newNodeId;
    }
  }

  cleanNodeInputs() {
    this.newNode.value.nodePosition.x = 0;
    this.newNode.value.nodePosition.y = 0;
    this.nodeConnections.value = [];
    this.newNode.value = {
      mapId: '',
      nodeDescription: '',
      nodeId: '',
      nodeName: '',
      nodePosition: {
        x: 0,
        y: 0,
      },
      vehicleTypeNodeProperties: [],
    };
  }

  updateNode(selectedNode: string) {
    this.layoutController.disableNodesDrag();

    if (!this.layoutController.nodes[selectedNode].vda5050Node) {
      return;
    }

    if (selectedNode) {
      this.layoutController.nodes[selectedNode].draggable = true;
    }
    this.newNode.value.mapId =
      this.layoutController.nodes[selectedNode].vda5050Node!.mapId;
    this.newNode.value.nodeDescription =
      this.layoutController.nodes[selectedNode].vda5050Node!.nodeDescription;
    this.newNode.value.nodeId =
      this.layoutController.nodes[selectedNode].vda5050Node!.nodeId;
    this.newNode.value.nodeName =
      this.layoutController.nodes[selectedNode].vda5050Node!.nodeName;
    this.newNode.value.vehicleTypeNodeProperties =
      this.layoutController.nodes[
        selectedNode
      ].vda5050Node!.vehicleTypeNodeProperties;

    const nodeEdges = Object.values(this.layoutController.edges).filter(
      connection => connection.source == selectedNode,
    );
    this.nodeConnections.value = Object.values(toRaw(nodeEdges)).map(
      node => node.target,
    );
  }
}
