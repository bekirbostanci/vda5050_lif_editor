<script setup lang="ts">
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'

import { TopBarController } from "@/controllers/topBar.controller";
const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
});
const openHelp = () => {
  window.open('https://github.com/bekirbostanci/vda5050_lif_editor', '_blank')
}
</script>

<template>
   <Menubar>
    <div class="flex items-center">
      <img src="/vda.svg" alt="logo" class="w-7 h-7" />
    </div>
    <MenubarMenu>
      <MenubarTrigger @click="props.topBarController.selectFile()">Open</MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger >Save</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="props.topBarController.convertLifToJson(); props.topBarController.saveLifJsonFile(true)">Save with Background</MenubarItem>
        <MenubarItem @click="props.topBarController.convertLifToJson(); props.topBarController.saveLifJsonFile(false)">Save without Background</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger @click="props.topBarController.toggleJson()">{{ props.topBarController.showJson.value ? 'Map' : 'Code' }}</MenubarTrigger>
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