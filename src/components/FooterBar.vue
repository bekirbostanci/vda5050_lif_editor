<script setup lang="ts">
import {Menubar, MenubarMenu, MenubarLabel} from '@/components/ui/menubar';
import {LayoutController} from '@/controllers/layout.controller';

const props = defineProps({
  layoutController: {
    type: LayoutController,
    required: false,
  },
});
</script>

<template>
  <Menubar>
    <MenubarMenu>
      <MenubarLabel v-if="props.layoutController">
        Layouts: {{ props.layoutController.vdaLayouts.length }}
      </MenubarLabel>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarLabel v-if="props.layoutController">
        Nodes: {{ Object.keys(props.layoutController.nodes).length }}
      </MenubarLabel>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarLabel v-if="props.layoutController">
        Edges: {{ Object.keys(props.layoutController.edges).length }}
      </MenubarLabel>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarLabel v-if="props.layoutController">
        Actions: {{ Object.keys(props.layoutController.actions).length }}
      </MenubarLabel>
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
