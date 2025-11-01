<script setup lang="ts">
/* Components */
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {SideBarController} from '@/controllers/sideBar.controller';
import {LayoutController} from '@/controllers/layout.controller';
import {SideBarNodeController} from '@/controllers/sideBarNode.controller';

const props = defineProps<{
  sidebar: SideBarController;
  layout: LayoutController;
  sideBarNode: SideBarNodeController;
}>();
</script>
<template>
  <div v-if="props.sidebar.selectedEdges.value[0]">
    <div class="grid gap-2 mt-2">
      <Label
        for="edge-id"
        :class="
          props.sideBarNode.createFast.value ? 'text-muted-foreground' : ''
        "
        >Edge Id</Label
      >
      <Input
        id="edge-id"
        :disabled="props.sideBarNode.createFast.value"
        v-model="props.sidebar.selectedEdges.value[0]"
      />
    </div>
    <div class="grid gap-2 mt-2">
      <Label for="edge-name">Edge Name</Label>
      <Input
        id="edge-name"
        v-model="
          props.layout.edges[props.sidebar.selectedEdges.value[0]].vda5050Edge
            .edgeName
        "
      />
    </div>
    <div class="grid gap-2 mt-2">
      <Label for="edge-description">Edge Description</Label>
      <Input
        id="edge-description"
        v-model="
          props.layout.edges[props.sidebar.selectedEdges.value[0]].vda5050Edge
            .edgeDescription
        "
      />
    </div>
    <div class="ml-auto flex w-full space-x-2 py-2">
      <div class="grid gap-2 mt-2">
        <Label for="startNode" class="text-muted-foreground"
          >Start Node Id</Label
        >
        <Input
          id="startNode"
          disabled
          :default-value="
            props.layout.edges[props.sidebar.selectedEdges.value[0]].source
          "
        />
      </div>
      <div class="grid gap-2 mt-2">
        <Label for="endNode" class="text-muted-foreground">End Node Id</Label>
        <Input
          id="endNode"
          disabled
          :default-value="
            props.layout.edges[props.sidebar.selectedEdges.value[0]].target
          "
        />
      </div>
    </div>
    <div class="ml-auto flex w-full space-x-2 mt-3">
      <Button
        variant="secondary"
        @click="props.layout.deleteEdge(props.sidebar.selectedEdges.value[0])"
        >Delete</Button
      >
    </div>
  </div>
</template>
