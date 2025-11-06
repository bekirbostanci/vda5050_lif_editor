<script setup lang="ts">
import {Icon} from '@iconify/vue';
import {Button} from '@/components/ui/button';
import LayoutDialog from './LayoutDialog.vue';
import LayoutSelect from './LayoutSelect.vue';
import MetaInformationDialog from './MetaInformationDialog.vue';
import {ref, computed} from 'vue';
import {LayoutController} from '@/controllers/layout.controller';
import {SideBarController} from '@/controllers/sideBar.controller';
import {SideBarNodeController} from '@/controllers/sideBarNode.controller';
import {SideBarStationController} from '@/controllers/sideBarStation.controller';

const props = defineProps<{
  layout?: LayoutController;
  sideBar?: SideBarController;
  sideBarNode?: SideBarNodeController;
  sideBarStation?: SideBarStationController;
}>();

const layoutDialogOpen = ref(false);
const layoutDialogMode = ref<'create' | 'edit'>('create');

const handleCreateNode = () => {
  if (!props.sideBar || !props.sideBarNode) return;
  props.sideBar.selectedNodes.value = [];
  props.sideBarNode.cleanNodeInputs();
  props.sideBar.setCreateNodeState();
};

const handleCreateStation = () => {
  if (!props.sideBar || !props.sideBarStation) return;
  props.sideBar.selectedStations.value = [];
  props.sideBarStation.cleanStationInputs();
  props.sideBar.setCreateStationState();
};

const handleCreateAction = () => {
  if (!props.sideBar) return;
  props.sideBar.setCrudAction();
};

const openCreateLayout = () => {
  layoutDialogMode.value = 'create';
  layoutDialogOpen.value = true;
};

const openEditLayout = () => {
  layoutDialogMode.value = 'edit';
  layoutDialogOpen.value = true;
};

const canUndo = computed(() => {
  return props.layout?.historyController.canUndo.value ?? false;
});

const canRedo = computed(() => {
  return props.layout?.historyController.canRedo.value ?? false;
});

const handleUndo = () => {
  props.layout?.undo();
};

const handleRedo = () => {
  props.layout?.redo();
};

const hasSelection = computed(() => {
  if (!props.sideBar || !props.layout) return false;
  return (
    props.sideBar.selectedNodes.value.length > 0 ||
    props.sideBar.selectedEdges.value.length > 0 ||
    props.sideBar.selectedStations.value.length > 0
  );
});

const handleDelete = () => {
  if (!props.layout || !props.sideBar) return;

  // Delete selected edges first
  if (props.sideBar.selectedEdges.value.length > 0) {
    props.sideBar.selectedEdges.value.forEach(edgeId => {
      props.layout?.deleteEdge(edgeId);
    });
    props.sideBar.selectedEdges.value = [];
  }

  // Delete selected nodes (this will also delete connected edges)
  if (props.sideBar.selectedNodes.value.length > 0) {
    props.sideBar.selectedNodes.value.forEach(nodeId => {
      props.layout?.deleteNode(nodeId);
    });
    props.sideBar.selectedNodes.value = [];
  }

  // Delete selected stations
  if (props.sideBar.selectedStations.value.length > 0) {
    props.sideBar.selectedStations.value.forEach(stationId => {
      props.layout?.deleteNode(stationId);
    });
    props.sideBar.selectedStations.value = [];
  }
};
</script>

<template>
  <div class="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-b bg-white z-10 overflow-x-auto">
    <!-- Node, Station, Action buttons -->
    <div class="flex items-center gap-1 shrink-0">
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8 sm:h-10 sm:w-10"
        title="Node"
        :disabled="!props.sideBar || !props.sideBar.selectedLayoutId.value"
        @click="handleCreateNode"
      >
        <Icon icon="ph:circle" :height="18" class="sm:h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8 sm:h-10 sm:w-10"
        title="Station"
        :disabled="!props.sideBar || !props.sideBar.selectedLayoutId.value"
        @click="handleCreateStation"
      >
        <Icon icon="ph:square" :height="18" class="sm:h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8 sm:h-10 sm:w-10"
        title="Action"
        :disabled="!props.sideBar || !props.sideBar.selectedLayoutId.value"
        @click="handleCreateAction"
      >
        <Icon icon="ph:lightning" :height="18" class="sm:h-5" />
      </Button>
    </div>

    <div class="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1 shrink-0"></div>

    <!-- Undo/Redo/Delete buttons -->
    <div class="flex items-center gap-1 shrink-0">
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8 sm:h-10 sm:w-10"
        title="Undo (Ctrl+Z)"
        :disabled="!props.layout || !canUndo"
        @click="handleUndo"
      >
        <Icon icon="ph:arrow-counter-clockwise" :height="18" class="sm:h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8 sm:h-10 sm:w-10"
        title="Redo (Ctrl+Y)"
        :disabled="!props.layout || !canRedo"
        @click="handleRedo"
      >
        <Icon icon="ph:arrow-clockwise" :height="18" class="sm:h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8 sm:h-10 sm:w-10"
        title="Delete Selected (Del)"
        :disabled="
          !props.layout ||
          !props.sideBar ||
          !hasSelection ||
          !props.sideBar.selectedLayoutId.value
        "
        @click="handleDelete"
      >
        <Icon icon="ph:trash" :height="18" class="sm:h-5" />
      </Button>
    </div>

    <div class="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1 shrink-0"></div>

    <!-- Create Layout, Edit Layout buttons -->
    <div class="flex items-center gap-1 shrink-0">
      <template v-if="props.layout && props.sideBar">
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8 sm:h-10 sm:w-10"
          title="Create Layout"
          @click="openCreateLayout"
        >
          <Icon icon="ph:plus-circle" :height="18" class="sm:h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8 sm:h-10 sm:w-10"
          title="Edit Layout"
          @click="openEditLayout"
        >
          <Icon icon="ph:pencil" :height="18" class="sm:h-5" />
        </Button>
        <LayoutDialog
          :open="layoutDialogOpen"
          @update:open="layoutDialogOpen = $event"
          :layout="props.layout"
          :tools="props.sideBar"
          :mode="layoutDialogMode"
        />
      </template>
      <template v-else>
        <Button variant="outline" size="icon" class="h-8 w-8 sm:h-10 sm:w-10" title="Create Layout" disabled>
          <Icon icon="ph:plus-circle" :height="18" class="sm:h-5" />
        </Button>
        <Button variant="outline" size="icon" class="h-8 w-8 sm:h-10 sm:w-10" title="Edit Layout" disabled>
          <Icon icon="ph:pencil" :height="18" class="sm:h-5" />
        </Button>
      </template>
    </div>

    <div class="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1 shrink-0"></div>

    <!-- Meta Information button -->
    <div class="shrink-0">
      <template v-if="props.layout">
        <MetaInformationDialog :layout="props.layout">
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8 sm:h-10 sm:w-10"
            title="Meta Information"
            :disabled="!props.sideBar || !props.sideBar.selectedLayoutId.value"
          >
            <Icon icon="material-symbols-light:info-outline" :height="18" class="sm:h-5" />
          </Button>
        </MetaInformationDialog>
      </template>
      <template v-else>
        <Button variant="outline" size="icon" class="h-8 w-8 sm:h-10 sm:w-10" title="Meta Information" disabled>
          <Icon icon="material-symbols-light:info-outline" :height="18" class="sm:h-5" />
        </Button>
      </template>
    </div>

    <!-- Layout Select on the right -->
    <div
      v-if="props.layout && props.sideBar"
      class="flex items-center gap-1 ml-auto shrink-0"
    >
      <LayoutSelect
        :layout="props.layout"
        :tools="props.sideBar"
      ></LayoutSelect>
    </div>
  </div>
</template>

<style scoped></style>
