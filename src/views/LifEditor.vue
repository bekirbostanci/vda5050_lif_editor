<script setup lang="ts">
import {TopBarController} from '@/controllers/topBar.controller';
import NetworkGraph from '../components/NetworkGraph.vue';
import TopBar from '@/components/TopBar.vue';
import ToolBar from '@/components/ToolBar.vue';
import FooterBar from '@/components/FooterBar.vue';
import {ref, onMounted, onUnmounted} from 'vue';

const topBarController = new TopBarController();
const networkGraphRef = ref();

// Keyboard shortcuts for undo/redo and delete
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl+Z or Cmd+Z for undo
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key === 'z' &&
    !event.shiftKey
  ) {
    event.preventDefault();
    networkGraphRef.value?.layoutController?.undo();
    return;
  }
  // Ctrl+Y or Cmd+Y for redo (also Ctrl+Shift+Z)
  if (
    ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
    ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
  ) {
    event.preventDefault();
    networkGraphRef.value?.layoutController?.redo();
    return;
  }
  // Delete or Backspace key for deleting selected objects
  // Only trigger if not typing in an input field
  if (
    (event.key === 'Delete' || event.key === 'Backspace') &&
    !(event.target instanceof HTMLInputElement) &&
    !(event.target instanceof HTMLTextAreaElement)
  ) {
    const layoutController = networkGraphRef.value?.layoutController;
    const sideBarController = networkGraphRef.value?.sideBarController;
    if (!layoutController || !sideBarController) return;

    // Check if there's a selection
    const hasSelection =
      sideBarController.selectedNodes.value.length > 0 ||
      sideBarController.selectedEdges.value.length > 0 ||
      sideBarController.selectedStations.value.length > 0;

    if (hasSelection) {
      event.preventDefault();

      // Delete selected edges first
      if (sideBarController.selectedEdges.value.length > 0) {
        sideBarController.selectedEdges.value.forEach((edgeId: string) => {
          layoutController.deleteEdge(edgeId);
        });
        sideBarController.selectedEdges.value = [];
      }

      // Delete selected nodes (this will also delete connected edges)
      if (sideBarController.selectedNodes.value.length > 0) {
        sideBarController.selectedNodes.value.forEach((nodeId: string) => {
          layoutController.deleteNode(nodeId);
        });
        sideBarController.selectedNodes.value = [];
      }

      // Delete selected stations
      if (sideBarController.selectedStations.value.length > 0) {
        sideBarController.selectedStations.value.forEach((stationId: string) => {
          layoutController.deleteNode(stationId);
        });
        sideBarController.selectedStations.value = [];
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="h-full flex-col md:flex">
    <TopBar :top-bar-controller="topBarController"></TopBar>
    <ToolBar
      :layout="networkGraphRef?.layoutController"
      :sideBar="networkGraphRef?.sideBarController"
      :sideBarNode="networkGraphRef?.sideBarNodeController"
      :sideBarStation="networkGraphRef?.sideBarStationController"
    ></ToolBar>
    <div class="h-full flex-1">
      <NetworkGraph
        ref="networkGraphRef"
        :top-bar-controller="topBarController"
      ></NetworkGraph>
    </div>
  </div>
  <FooterBar
    class="fixed bottom-0 left-0 w-full"
    :layout-controller="networkGraphRef?.layoutController"
  >
  </FooterBar>
</template>
