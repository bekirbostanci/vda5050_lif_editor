<script setup lang="ts">
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
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
          >Save LIF</MenubarItem
        >
        <MenubarItem @click="props.topBarController.saveLifJsonFile(true)"
          >Save LIF (with Background)</MenubarItem
        >
        <MenubarItem @click="props.topBarController.saveRosJsonFile()"
          >Save ROS Geograph</MenubarItem
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
