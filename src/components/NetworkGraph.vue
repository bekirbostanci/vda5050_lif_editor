<script setup lang="ts">
import { ref } from "vue";
import { EventHandlers, ViewEvent, Instance } from "v-network-graph";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import { Separator } from "./ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

import SideBar from "./SideBar.vue";
import SideBarNode from "./SideBarNode.vue";
import configs from "@/utils/GraphConfig";

import { LayoutController } from "@/controllers/layout.controller";
import { SideBarController } from "@/controllers/sideBar.controller";
import { ToolState } from "@/types/ToolState";
import { SideBarNodeController } from "@/controllers/sideBarNode.controller";
import { TopBarController } from "@/controllers/topBar.controller";
import StationBar from "./SideBarStation.vue";
import SideBarEdge from "./SideBarEdge.vue";
import { SideBarStationController } from "@/controllers/sideBarStation.controller";

const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
});

const graph = ref<Instance>();
const layoutController = new LayoutController();
const sideBarController = new SideBarController();
const sideBarNodeController = new SideBarNodeController(
  sideBarController,
  layoutController,
  graph
);
const sideBarStationController = new SideBarStationController(layoutController);
props.topBarController.layoutController = layoutController;
const eventHandlers: EventHandlers = {
  "view:click": (mouseEvent: ViewEvent<MouseEvent>) => {
    layoutController.disableNodesDrag();
    if (sideBarController.toolState.value == ToolState.createNode ||
      sideBarController.toolState.value == ToolState.selectNode) {
      sideBarNodeController.createNodeFast(mouseEvent);
    }
  },
  "node:select": (nodes) => {
    if (nodes.length > 0) {
      if (layoutController.nodes[nodes[0]].vda5050Node) {
        sideBarController.setSelectNodeTool();
        sideBarNodeController.updateNode(nodes[0]);
      } else if (layoutController.nodes[nodes[0]].vda5050Station) {
        sideBarController.setSelectStationTool();
        sideBarStationController.updateStation(nodes[0]);
        sideBarController.selectedStations.value[0] = nodes[0];
      }
    } else {
      sideBarNodeController.cleanNodeInputs();
      sideBarStationController.cleanStationInputs();
      layoutController.disableNodesDrag();
    }
  },
  "edge:select": (edges) => {
    if (edges.length > 0) {
      sideBarController.setSelectEdgeTool();
    }
  },
};
function getWindowWidth() {
  return window.innerWidth;
}
</script>

<template>
  <div class="p-0" v-if="props.topBarController.showJson.value">
    <vue-json-pretty :data="layoutController.lif" />
  </div>
  <div class="page" v-else>
    <ResizablePanelGroup id="sidebar" class="rounded-lg border"
      :direction="getWindowWidth() < 768 ? 'vertical' : 'horizontal'">
      <ResizablePanel id="demo-panel-1" :default-size="15">
        <SideBar class="p-6" :layout="layoutController" :sideBar="sideBarController"
          :side-bar-node="sideBarNodeController" :side-bar-station="sideBarStationController" />
      </ResizablePanel>
      <ResizableHandle id="handle-1" with-handle />
      <ResizablePanel id="network-graph" :default-size="60">
        <div class="graph flex items-center justify-center">
          <v-network-graph ref="graph" class="graph" zoom-level="200" :nodes="layoutController.nodes"
            :edges="layoutController.edges" :layouts="layoutController.layouts" :configs="configs"
            v-model:selected-nodes="sideBarController.selectedNodes.value"
            v-model:selected-edges="sideBarController.selectedEdges.value" :event-handlers="eventHandlers">
            <template #edge-label="{ edge, ...slotProps }">
              <v-edge-label v-if="configs.edge.label.visible" :text="edge.vda5050Edge.edgeName" align="center"
                vertical-align="above" v-bind="slotProps" />
            </template>
          </v-network-graph>
        </div>
      </ResizablePanel>
      <ResizableHandle id="handle-2" with-handle />
      <ResizablePanel v-if="sideBarController.toolState.value != ToolState.empty" id="sidebar-extra" :default-size="20">
        <div class="p-6" v-if="sideBarController.toolState.value == ToolState.createNode">
          <span @click=""
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Create Node
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <SideBarNode :layout="layoutController" :sidebar="sideBarController" :side-bar-node="sideBarNodeController" />
        </div>
        <div class="p-6" v-if="sideBarController.toolState.value == ToolState.selectNode">
          <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Edit Node
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <SideBarNode :layout="layoutController" :sidebar="sideBarController" :side-bar-node="sideBarNodeController" />
        </div>
        <div class="p-6" v-if="sideBarController.toolState.value == ToolState.selectEdge">
          <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Edit Edge
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <SideBarEdge :layout="layoutController" :sidebar="sideBarController" :side-bar-node="sideBarNodeController" />
        </div>
        <div class="p-6" v-if="sideBarController.toolState.value == ToolState.createStation">
          <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Create Station
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <StationBar :sidebar-station="sideBarStationController" :layout="layoutController"
            :sidebar="sideBarController" :side-bar-node="sideBarNodeController" />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<style>
.graph {
  width: 100%;
  height: 100%;
}

@media (max-width: 767px) {
  .page {
    height: 1500px;
  }
}

@media (min-width: 768px) {
  .page {
    height: calc(100svh - 120px);
  }
}
</style>
