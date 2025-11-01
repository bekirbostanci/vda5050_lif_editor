<script setup lang="ts">
import {Icon} from '@iconify/vue';
import {Button} from '@/components/ui/button';
import LayoutDialog from './LayoutDialog.vue';
import LayoutSelect from './LayoutSelect.vue';
import MetaInformationDialog from './MetaInformationDialog.vue';
import {ref} from 'vue';
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
</script>

<template>
  <div class="flex items-center gap-2 px-4 py-2 border-b bg-white z-10">
    <!-- Node, Station, Action buttons -->
    <Button
      variant="outline"
      size="icon"
      title="Node"
      :disabled="!props.sideBar || !props.sideBar.selectedLayoutId.value"
      @click="handleCreateNode"
    >
      <Icon icon="ph:circle" :height="20" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      title="Station"
      :disabled="!props.sideBar || !props.sideBar.selectedLayoutId.value"
      @click="handleCreateStation"
    >
      <Icon icon="ph:square" :height="20" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      title="Action"
      :disabled="!props.sideBar || !props.sideBar.selectedLayoutId.value"
      @click="handleCreateAction"
    >
      <Icon icon="ph:lightning" :height="20" />
    </Button>

    <div class="w-px h-6 bg-border mx-1"></div>

    <!-- Create Layout, Edit Layout buttons -->
    <template v-if="props.layout && props.sideBar">
      <Button
        variant="outline"
        size="icon"
        title="Create Layout"
        @click="openCreateLayout"
      >
        <Icon icon="ph:plus-circle" :height="20" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        title="Edit Layout"
        @click="openEditLayout"
      >
        <Icon icon="ph:pencil" :height="20" />
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
      <Button variant="outline" size="icon" title="Create Layout" disabled>
        <Icon icon="ph:plus-circle" :height="20" />
      </Button>
      <Button variant="outline" size="icon" title="Edit Layout" disabled>
        <Icon icon="ph:pencil" :height="20" />
      </Button>
    </template>

    <div class="w-px h-6 bg-border mx-1"></div>

    <!-- Meta Information button -->
    <template v-if="props.layout">
      <MetaInformationDialog :layout="props.layout">
        <Button
          variant="outline"
          size="icon"
          title="Meta Information"
          :disabled="!props.sideBar || !props.sideBar.selectedLayoutId.value"
        >
          <Icon icon="material-symbols-light:info-outline" :height="20" />
        </Button>
      </MetaInformationDialog>
    </template>
    <template v-else>
      <Button variant="outline" size="icon" title="Meta Information" disabled>
        <Icon icon="material-symbols-light:info-outline" :height="20" />
      </Button>
    </template>

    <!-- Layout Select on the right -->
    <div
      v-if="props.layout && props.sideBar"
      class="flex items-center gap-1 ml-auto"
    >
      <LayoutSelect
        :layout="props.layout"
        :tools="props.sideBar"
      ></LayoutSelect>
    </div>
  </div>
</template>

<style scoped></style>
