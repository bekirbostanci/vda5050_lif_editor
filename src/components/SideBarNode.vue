<script setup lang="ts">
/* Third Party */
import { computed, ref, toRaw } from "vue";

/* Components */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SideBarController } from "@/controllers/sideBar.controller";
import { LayoutController } from "@/controllers/layout.controller";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
  ComboboxAnchor,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from "radix-vue";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import { SideBarNodeController } from "@/controllers/sideBarNode.controller";
import { Search } from "@/types/Search";
import VehicleNodePropertiesDialog from "./VehicleNodePropertiesDialog.vue";

const props = defineProps<{
  sidebar: SideBarController;
  layout: LayoutController;
  sideBarNode: SideBarNodeController;
}>();
const open = ref(false);
const searchTerm = ref("");

const frameworks: Search[] = [];
Object.values(toRaw(props.layout.nodes)).map((node) => {
  if (node.vda5050Node) {
    frameworks.push({ value: node.vda5050Node.nodeId, label: node.vda5050Node.nodeId })
  }
});

const filteredFrameworks = computed(() =>
  frameworks.filter(
    (i) => !props.sideBarNode.nodeConnections.value.includes(i.label)
  )
);
</script>
<template>
  <div class="grid gap-2 mt-2">
    <div class="flex items-center">
      <Label for="nodeId">Node Id</Label>
      <div class="inline-flex ml-auto">
        <Label v-if="!props.sideBarNode.createFast.value" class="px-3 text-sm text-muted-foreground" for="fast-create">
          Fast Create</Label>
        <Label v-if="props.sideBarNode.createFast.value" class="px-3 text-sm" for="fast-create"> Fast Create</Label>
        <Switch id="fast-create" v-model:checked="props.sideBarNode.createFast.value" />
      </div>
    </div>
    <HoverCard :open-delay="2000">
      <HoverCardTrigger>
      </HoverCardTrigger>
      <HoverCardContent>
        Unique identifier of the node across all layouts contained in this LIF
        file.
      </HoverCardContent>
    </HoverCard>
    <Input id="nodeId" :disabled="props.sideBarNode.createFast.value"
      v-model="props.sideBarNode.newNode.value.nodeId" />
  </div>
  <div class="grid gap-2 mt-2">
    <HoverCard :open-delay="2000">
      <HoverCardTrigger>
        <Label for="nodeName">Node Name</Label>
      </HoverCardTrigger>
      <HoverCardContent>Unique identifier of the node across all layouts contained in this LIF
        file.
      </HoverCardContent>
    </HoverCard>
    <Input id="nodeName" :disabled="props.sideBarNode.createFast.value"
      v-model="props.sideBarNode.newNode.value.nodeName" />
  </div>
  <div class="grid gap-2 mt-2">
    <HoverCard :close-delay="0" :open-delay="2000">
      <HoverCardTrigger>
        <Label for="nodeDescription">Node Description</Label>
      </HoverCardTrigger>
      <HoverCardContent>Brief description of the node. This should only ever be for
        visualization or diagnostic purposes.
      </HoverCardContent>
    </HoverCard>
    <Input id="nodeDescription" :disabled="props.sideBarNode.createFast.value"
      v-model="props.sideBarNode.newNode.value.nodeDescription" />
  </div>
  <div class="ml-auto flex w-full space-x-2 py-2">
    <div class="grid gap-2 mt-2" v-if="props.sidebar.selectedNodes.value.length > 0">
      <Label for="nodeX">Node X</Label>
      <Input id="nodeX" type="number" :default-value="0"
        v-model="props.layout.layouts.nodes[props.sidebar.selectedNodes.value[0]].x" />
    </div>
    <div class="grid gap-2 mt-2" v-else>
      <Label for="nodeX">Node X</Label>
      <Input id="nodeX" type="number" :default-value="0" v-model="props.sideBarNode.newNode.value.nodePosition.x" />
    </div>
    <div class="grid gap-2 mt-2" v-if="props.sidebar.selectedNodes.value.length > 0">
      <Label for="nodeY">Node Y</Label>
      <Input id="nodeY" type="number" :default-value="0"
        v-model="props.layout.layouts.nodes[props.sidebar.selectedNodes.value[0]].y" />
    </div>
    <div class="grid gap-2 mt-2" v-else>
      <Label for="nodeY">Node Y</Label>
      <Input id="nodeY" type="number" :default-value="0" v-model="props.sideBarNode.newNode.value.nodePosition.y" />
    </div>
  </div>
  <div class="grid gap-2 mt-2">
    <HoverCard :open-delay="2000">
      <HoverCardTrigger>
        <Label for="mapId">Map Id</Label>
      </HoverCardTrigger>
      <HoverCardContent>
        Unique identification of the map in which the node oder node‘s position
        is referenced. Each map has the same project specific global origin of
        coordinates. When a vehicle uses an elevator, e.g., leading from a
        departure floor to a target floor, it will disappear off the map of the
        departure floor and spawn in the related lift node on the map of the
        target floor.</HoverCardContent>
    </HoverCard>
    <Input id="mapId" :disabled="props.sideBarNode.createFast.value" v-model="props.sideBarNode.newNode.value.mapId" />
  </div>

  <div class="grid gap-2 mt-4">
    <Label for="mapId">Connected Nodes</Label>
    <TagsInput class="px-0 gap-0 mt-1" :model-value="props.sideBarNode.nodeConnections.value" @update:model-value="
      props.layout.updateEdges(
        props.sideBarNode.newNode.value.nodeId,
        props.sideBarNode.nodeConnections.value
      )
      ">
      <div class="flex gap-2 flex-wrap items-center px-3">
        <TagsInputItem v-for="item in props.sideBarNode.nodeConnections.value" :key="item" :value="item">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      </div>

      <ComboboxRoot v-model="props.sideBarNode.nodeConnections" v-model:open="open" v-model:searchTerm="searchTerm"
        class="w-full">
        <ComboboxAnchor as-child>
          <ComboboxInput placeholder="Nodes.." as-child>
            <TagsInputInput class="w-full px-3" :class="props.sideBarNode.nodeConnections.value.length > 0 ? 'mt-2' : ''
              " @keydown.enter.prevent />
          </ComboboxInput>
        </ComboboxAnchor>

        <ComboboxPortal>
          <CommandList position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
            <CommandEmpty />
            <CommandGroup>
              <CommandItem v-for="framework in filteredFrameworks" :key="framework.value" :value="framework.label"
                @select.prevent="(ev) => {
                  if (typeof ev.detail.value === 'string') {
                    searchTerm = '';
                    props.sideBarNode.nodeConnections.value.push(
                      ev.detail.value
                    );
                    open = false;
                  }

                  if (filteredFrameworks.length === 0) {
                    open = false;
                  }
                }
                  ">
                {{ framework.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxPortal>
      </ComboboxRoot>
    </TagsInput>
  </div>
  <div class="grid gap-2 mt-4">
    <Label for="mapId">Vehicle Node Properties</Label>
    <TagsInput disabled v-model="props.sideBarNode.newNode.value.vehicleTypeNodeProperties">
      <TagsInputItem v-for="item in props.sideBarNode.newNode.value.vehicleTypeNodeProperties"
        :key="item.vehicleTypeId + '-node-properties'"
        :value="item.vehicleTypeId + (item.actions.length > 0 ? ('->' + item.actions.map((action) => action.actionType).join(',')) : '')">
        <TagsInputItemText />
        <TagsInputItemDelete
          @click="props.sideBarNode.newNode.value.vehicleTypeNodeProperties = props.sideBarNode.newNode.value.vehicleTypeNodeProperties.filter((property) => property !== item)" />
      </TagsInputItem>
      <VehicleNodePropertiesDialog :layout="props.layout" :side-bar-node="props.sideBarNode" />
    </TagsInput>
  </div>
  <div class="ml-auto flex w-full space-x-2 mt-3">
    <Button variant="secondary" @click="props.layout.createNode(props.sideBarNode.newNode.value)">Save</Button>
    <Button variant="secondary"
      @click="props.sidebar.selectedNodes.value = []; props.layout.deleteNode(props.sideBarNode.newNode.value.nodeId);">Delete</Button>
  </div>
</template>
