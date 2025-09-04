<script setup lang="ts">
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from '@/components/ui/menubar';

import {TopBarController} from '@/controllers/topBar.controller';
const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
});
const openHelp = () => {
  window.open('https://github.com/bekirbostanci/vda5050_lif_editor', '_blank');
};
</script>

<template>
  <Menubar>
    <div class="flex items-center">
      <img src="/vda.svg" alt="logo" class="w-7 h-7" />
    </div>
    <MenubarMenu>
      <MenubarTrigger @click="props.topBarController.selectFile()"
        >Open</MenubarTrigger
      >
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Save</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="props.topBarController.saveLifJsonFile(false)"
          >Export LIF</MenubarItem
        >
        <MenubarItem @click="props.topBarController.saveLifJsonFile(true)"
          >Export LIF (with Background)</MenubarItem
        >
        <MenubarItem @click="props.topBarController.saveRosJsonFile()"
          >Export ROS GeoJson</MenubarItem
        >
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu
      v-if="
        !props.topBarController.showLifJson.value &&
        !props.topBarController.showRosJson.value
      "
    >
      <MenubarTrigger @click="props.topBarController.toggleLifJson()">
        LIF
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu
      v-if="
        !props.topBarController.showLifJson.value &&
        !props.topBarController.showRosJson.value
      "
    >
      <MenubarTrigger @click="props.topBarController.toggleRosJson()">
        ROS
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu
      v-if="
        props.topBarController.showRosJson.value ||
        props.topBarController.showLifJson.value
      "
    >
      <MenubarTrigger @click="props.topBarController.toggleMap()">
        Map
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Visualization</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="props.topBarController.toggleEdgeAnimation()">
          {{
            props.topBarController.edgeAnimationEnabled.value ? 'Stop' : 'Start'
          }}
          Animation
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="props.topBarController.toggleNodes()">
          {{ props.topBarController.showNodes.value ? 'Hide' : 'Show' }} Nodes
        </MenubarItem>
        <MenubarItem @click="props.topBarController.toggleEdges()">
          {{ props.topBarController.showEdges.value ? 'Hide' : 'Show' }} Edges
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="props.topBarController.toggleNodeLabels()">
          {{ props.topBarController.showNodeLabels.value ? 'Hide' : 'Show' }}
          Node Labels
        </MenubarItem>
        <MenubarItem @click="props.topBarController.toggleEdgeLabels()">
          {{ props.topBarController.showEdgeLabels.value ? 'Hide' : 'Show' }}
          Edge Labels
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="props.topBarController.toggleGrid()">
          {{ props.topBarController.showGrid.value ? 'Hide' : 'Show' }} Grid
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger @click="openHelp">Help</MenubarTrigger>
    </MenubarMenu>
  </Menubar>
</template>
<style scoped>
#top-bar {
  background-color: white;
  z-index: 10;
}

@media (min-width: 768px) {
  .hide-on-desktop {
    display: none;
  }
}

@media (max-width: 767px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>
