<script setup lang="ts">
import { Separator } from "./ui/separator";
import SideBar from "./SideBar.vue";
import SideBarNode from "./SideBarNode.vue";
("./SideBarNode.vue");
import configs from "../utils/GraphConfig";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { Layout } from "@/controllers/layout";
import { Tools } from "@/controllers/tools";
import { ToolState } from "@/types/ToolState";

const layout = new Layout();
const tools = new Tools();
</script>

<template>
  <ResizablePanelGroup
    id="demo-group-1"
    direction="horizontal"
    class="max-w rounded-lg border"
  >
    <ResizablePanel id="demo-panel-1" :default-size="70">
      <div class="flex h-[800px] items-center justify-center">
        <v-network-graph
          class="graph"
          :nodes="layout.nodes"
          :edges="layout.edges"
          :configs="configs"
          :selected-nodes="tools.selectedNodes.value"
          :selected-edges="tools.selectedEdges.value"
          :event-handlers="tools.eventHandlers"
        />
      </div>
    </ResizablePanel>
    <ResizableHandle id="demo-handle-1" />
    <ResizablePanel id="demo-panel-2" :default-size="15">
      <SideBar class="p-6" :layout="layout" :tools="tools"
    /></ResizablePanel>
    <ResizableHandle id="demo-handle-2" />
    <ResizablePanel
      v-if="tools.toolState.value != ToolState.empty"
      id="demo-panel-3"
      :default-size="15"
    >
      <div class="p-6" v-if="tools.toolState.value == ToolState.createNode">
        <span
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Create Node
        </span>
        <Separator class="mt-3 mb-3" orientation="horizontal" />
        <SideBarNode :layout="layout" :tools="tools" />
      </div>
      <div class="p-6" v-if="tools.toolState.value == ToolState.selectNode">
        <span
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Edit Node
        </span>
        <Separator class="mt-3 mb-3" orientation="horizontal" />
        <SideBarNode :layout="layout" :tools="tools" />
      </div>
      <div class="p-6" v-if="tools.toolState.value == ToolState.selectEdge">
        <span
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
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
