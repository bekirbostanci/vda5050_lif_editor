<script setup lang="ts">
import {ref, watch, computed} from 'vue';
import {EventHandlers, ViewEvent, Instance} from 'v-network-graph';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import {Separator} from './ui/separator';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './ui/resizable';

import SideBar from './SideBar.vue';
import SideBarNode from './SideBarNode.vue';
import configs from '@/utils/graphConfig';

import {LayoutController} from '@/controllers/layout.controller';
import {SideBarController} from '@/controllers/sideBar.controller';
import {ToolState} from '@/types/toolState';
import {SideBarNodeController} from '@/controllers/sideBarNode.controller';
import {TopBarController} from '@/controllers/topBar.controller';
import SideBarStation from './SideBarStation.vue';
import SideBarAction from './SideBarAction.vue';
import SideBarEdge from './SideBarEdge.vue';
import {SideBarStationController} from '@/controllers/sideBarStation.controller';

const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
});

const graph = ref<Instance>();
const layoutController = new LayoutController(graph);
const sideBarController = new SideBarController();
const sideBarNodeController = new SideBarNodeController(
  sideBarController,
  layoutController,
  graph,
);
const sideBarStationController = new SideBarStationController(layoutController);
props.topBarController.layoutController = layoutController;

defineExpose({
  layoutController,
});

const eventHandlers: EventHandlers = {
  'view:click': (mouseEvent: ViewEvent<MouseEvent>) => {
    handleViewClick(mouseEvent);
  },
  'node:select': nodes => {
    handleNodeSelect(nodes);
  },
  'edge:select': edges => {
    handleEdgeSelect(edges);
  },
};

function handleViewClick(mouseEvent: ViewEvent<MouseEvent>) {
  layoutController.disableNodesDrag();
  if (sideBarController.isCreateOrSelectNodeTool()) {
    sideBarNodeController.createNodeFast(mouseEvent);
  }
}

function handleNodeSelect(nodes: string[]) {
  if (nodes.length > 0) {
    if (layoutController.isVda5050Node(nodes[0])) {
      sideBarController.setSelectNodeTool();
      sideBarNodeController.updateNode(nodes[0]);
    } else if (layoutController.isVda5050Station(nodes[0])) {
      sideBarController.setSelectStationTool();
      sideBarStationController.updateStation(nodes[0]);
      sideBarController.selectedStations.value[0] = nodes[0];
    }
  } else {
    sideBarNodeController.cleanNodeInputs();
    sideBarStationController.cleanStationInputs();
    layoutController.disableNodesDrag();
  }
}

function handleEdgeSelect(edges: string[]) {
  if (edges.length > 0) {
    sideBarController.setSelectEdgeTool();
  }
}

function getWindowWidth() {
  return window.innerWidth;
}

watch(layoutController.layouts.nodes, () => {
  if (
    layoutController.layouts.nodes[sideBarNodeController.newNode.value.nodeId]
  ) {
    sideBarNodeController.updateNodeY(
      layoutController.layouts.nodes[sideBarNodeController.newNode.value.nodeId]
        .y,
    );
  }
  if (
    layoutController.layouts.nodes[
      sideBarStationController.newStation.value.stationId
    ]
  ) {
    sideBarStationController.updateStationY(
      layoutController.layouts.nodes[
        sideBarStationController.newStation.value.stationId
      ].y,
    );
  }
});

// additional layers definition
const layers = {
  map: 'base',
};

// Computed properties for filtered nodes and edges based on visibility
const visibleNodes = computed(() => {
  if (props.topBarController.showNodes.value) {
    return layoutController.nodes;
  }
  return {};
});

const visibleEdges = computed(() => {
  if (props.topBarController.showEdges.value) {
    return layoutController.edges;
  }
  return {};
});

// Computed property for graph configuration with dynamic label visibility and animation
const dynamicConfigs = computed(() => {
  return {
    ...configs,
    node: {
      ...configs.node,
      label: {
        ...configs.node.label,
        visible: props.topBarController.showNodeLabels.value,
      },
    },
    edge: {
      ...configs.edge,
      label: {
        ...configs.edge.label,
        visible: props.topBarController.showEdgeLabels.value,
      },
      normal: {
        ...configs.edge.normal,
        animate: props.topBarController.edgeAnimationEnabled.value,
      },
    },
  };
});
</script>

<template>
  <div class="p-0" v-if="props.topBarController.showLifJson.value">
    <vue-json-pretty :data="layoutController.lif" />
  </div>
  <div class="p-0" v-else-if="props.topBarController.showRosJson.value">
    <vue-json-pretty :data="layoutController.ros" />
  </div>
  <div class="page" v-else>
    <ResizablePanelGroup
      id="sidebar"
      :direction="getWindowWidth() < 768 ? 'vertical' : 'horizontal'"
    >
      <ResizablePanel
        style="min-width: 280px"
        id=" demo-panel-1"
        :default-size="15"
      >
        <SideBar
          class="p-6"
          :layout="layoutController"
          :sideBar="sideBarController"
          :side-bar-node="sideBarNodeController"
          :side-bar-station="sideBarStationController"
        />
      </ResizablePanel>
      <ResizableHandle id="handle-1" with-handle />
      <ResizablePanel id="network-graph" :default-size="60">
        <div class="graph flex items-center justify-center">
          <v-network-graph
            ref="graph"
            class="graph"
            zoom-level="200"
            :nodes="visibleNodes"
            :edges="visibleEdges"
            :layouts="layoutController.layouts"
            :configs="dynamicConfigs"
            v-model:selected-nodes="sideBarController.selectedNodes.value"
            :layers="layers"
            v-model:selected-edges="sideBarController.selectedEdges.value"
            :event-handlers="eventHandlers"
          >
            <template #map v-if="layoutController.backgroundImage.value.image">
              <image
                :href="layoutController.backgroundImage.value.image"
                :x="layoutController.backgroundImage.value.x"
                :y="layoutController.backgroundImage.value.y"
                :width="layoutController.backgroundImage.value.width + 'px'"
                :height="layoutController.backgroundImage.value.height + 'px'"
              />
            </template>
            <template #edge-label="{edge, ...slotProps}">
              <v-edge-label
                v-if="dynamicConfigs.edge.label.visible"
                :text="edge.vda5050Edge.edgeName"
                align="center"
                vertical-align="above"
                v-bind="slotProps"
              />
            </template>
          </v-network-graph>
        </div>
      </ResizablePanel>
      <ResizableHandle id="handle-2" with-handle />
      <ResizablePanel
        style="min-width: 280px"
        v-if="sideBarController.toolState.value != ToolState.empty"
        id="sidebar-extra"
        :default-size="20"
      >
        <div
          class="p-6"
          v-if="sideBarController.toolState.value == ToolState.createNode"
        >
          <span
            @click=""
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Create Node
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <SideBarNode
            :layout="layoutController"
            :sidebar="sideBarController"
            :side-bar-node="sideBarNodeController"
          />
        </div>
        <div
          class="p-6"
          v-if="sideBarController.toolState.value == ToolState.selectNode"
        >
          <span
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Edit Node
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <SideBarNode
            :layout="layoutController"
            :sidebar="sideBarController"
            :side-bar-node="sideBarNodeController"
          />
        </div>
        <div
          class="p-6"
          v-if="sideBarController.toolState.value == ToolState.selectEdge"
        >
          <span
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Edit Edge
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <SideBarEdge
            :layout="layoutController"
            :sidebar="sideBarController"
            :side-bar-node="sideBarNodeController"
          />
        </div>
        <div
          class="p-6"
          v-if="sideBarController.toolState.value == ToolState.createStation"
        >
          <span
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Create Station
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <SideBarStation
            :sidebar-station="sideBarStationController"
            :layout="layoutController"
            :sidebar="sideBarController"
            :side-bar-node="sideBarNodeController"
          />
        </div>
        <div
          class="p-6"
          v-if="sideBarController.toolState.value == ToolState.crudAction"
        >
          <span
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Action
          </span>
          <Separator class="mt-3 mb-3" orientation="horizontal" />
          <SideBarAction :layout="layoutController"></SideBarAction>
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
    height: calc(100svh - 74px);
  }
}
</style>
