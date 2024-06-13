<script setup lang="ts">
import { EventHandlers } from "v-network-graph";

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
import { ToolController } from "@/controllers/tool.controller";
import { ToolState } from "@/types/ToolState";
import { SideBarNodeController } from "@/controllers/sideBarNode.controller";

const layoutController = new LayoutController();
const toolController = new ToolController();
const sideBarNodeController = new SideBarNodeController(
  toolController,
  layoutController
);

const eventHandlers: EventHandlers = {
  "view:click": () => {
    sideBarNodeController.cleanNode();
    layoutController.resetAllDrag();
  },
  "node:select": (nodes) => {
    if (nodes.length > 0) {
      toolController.setSelectNodeTool();
      sideBarNodeController.updateNode(nodes[0]);
    } else {
      sideBarNodeController.cleanNode();
      layoutController.resetAllDrag();
    }
  },
  "edge:select": ({ }) => {
    toolController.setSelectEdgeTool();
  },
};
</script>

<template>
  <ResizablePanelGroup id="demo-group-1" direction="horizontal" class="max-w rounded-lg border">
    <ResizablePanel id="demo-panel-1" :max-size="15">
      <SideBar class="p-6" :layout="layoutController" :tools="toolController" :side-bar-node="sideBarNodeController" />

    </ResizablePanel>
    <ResizableHandle id="demo-handle-1" />
    <ResizablePanel id="demo-panel-2" :default-size="65">

      <div class="flex h-[800px] items-center justify-center">
        <v-network-graph class="graph" zoom-level="200" :nodes="layoutController.nodes" :edges="layoutController.edges"
          :layouts="layoutController.layouts" :configs="configs"
          v-model:selected-nodes="toolController.selectedNodes.value"
          v-model:selected-edges="toolController.selectedEdges.value" :event-handlers="eventHandlers" />
      </div>
    </ResizablePanel>
    <ResizableHandle id="demo-handle-2" />
    <ResizablePanel v-if="toolController.toolState.value != ToolState.empty" id="demo-panel-3" :default-size="20">
      <div class="p-6" v-if="toolController.toolState.value == ToolState.createNode">
        <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Create Node
        </span>
        <Separator class="mt-3 mb-3" orientation="horizontal" />
        <SideBarNode :layout="layoutController" :tools="toolController" :side-bar-node="sideBarNodeController" />
      </div>
      <div class="p-6" v-if="toolController.toolState.value == ToolState.selectNode">
        <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Edit Node
        </span>
        <Separator class="mt-3 mb-3" orientation="horizontal" />
        <SideBarNode :layout="layoutController" :tools="toolController" :side-bar-node="sideBarNodeController" />
      </div>
      <div class="p-6" v-if="toolController.toolState.value == ToolState.selectEdge">
        <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Edit Edge
        </span>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>

  <div class="grid h-full items-stretch gap-6 md:grid-cols-3">
    <div class="md:order-1">
      <div class="flex h-full flex-col space-y-4">
        <div class="flex items-center space-x-2"></div>
      </div>
    </div>
  </div>
</template>

<style>
.graph {
  width: 100%;
  height: 800px;
  border: 1px solid #ecf0f1;
}
</style>
