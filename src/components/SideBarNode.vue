<script setup lang="ts">
/* Third Party */
import {computed, ref, toRaw} from 'vue';

/* Components */
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch';
import {SideBarController} from '@/controllers/sideBar.controller';
import {LayoutController} from '@/controllers/layout.controller';

import {
  ComboboxAnchor,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from 'radix-vue';
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';
import {SideBarNodeController} from '@/controllers/sideBarNode.controller';
import {Search} from '@/types/search';
import VehicleNodePropertiesDialog from './VehicleNodePropertiesDialog.vue';

const props = defineProps<{
  sidebar: SideBarController;
  layout: LayoutController;
  sideBarNode: SideBarNodeController;
}>();
const open = ref(false);
const searchTerm = ref('');

const frameworks = ref<Search[]>([]);
Object.values(toRaw(props.layout.nodes)).map(node => {
  if (node.vda5050Node) {
    frameworks.value.push({
      value: node.vda5050Node.nodeId,
      label: node.vda5050Node.nodeId,
    });
  }
});
const filteredFrameworks = computed(() =>
  frameworks.value.filter(
    i => !props.sideBarNode.nodeConnections.value.includes(i.label),
  ),
);
</script>
<template>
  <div class="grid gap-2 mt-2">
    <div class="flex items-center">
      <Label
        for="nodeId"
        :class="
          props.sideBarNode.createFast.value ? 'text-muted-foreground' : ''
        "
        >Node Id</Label
      >
      <div class="inline-flex ml-auto">
        <Label
          :class="
            props.sideBarNode.createDoubleWay.value
              ? 'px-3 text-sm'
              : 'px-3 text-sm text-muted-foreground'
          "
          for="double-way"
        >
          Double Way</Label
        >
        <Switch
          id="double-way"
          :disabled="!props.sideBarNode.createFast.value"
          v-model:checked="props.sideBarNode.createDoubleWay.value"
        />
      </div>
      <div class="inline-flex ml-auto">
        <Label
          :class="
            props.sideBarNode.createFast.value
              ? 'px-3 text-sm'
              : 'px-3 text-sm text-muted-foreground'
          "
          for="fast-create"
        >
          Fast Create</Label
        >
        <Switch
          id="fast-create"
          v-model:checked="props.sideBarNode.createFast.value"
        />
      </div>
    </div>
    <Input
      id="nodeId"
      :disabled="props.sideBarNode.createFast.value"
      v-model="props.sideBarNode.newNode.value.nodeId"
    />
  </div>
  <div class="grid gap-2 mt-2">
    <Label
      for="nodeName"
      :class="props.sideBarNode.createFast.value ? 'text-muted-foreground' : ''"
      >Node Name</Label
    >
    <Input
      id="nodeName"
      :disabled="props.sideBarNode.createFast.value"
      v-model="props.sideBarNode.newNode.value.nodeName"
    />
  </div>
  <div class="grid gap-2 mt-2">
    <Label
      for="nodeDescription"
      :class="props.sideBarNode.createFast.value ? 'text-muted-foreground' : ''"
      >Node Description</Label
    >
    <Input
      id="nodeDescription"
      :disabled="props.sideBarNode.createFast.value"
      v-model="props.sideBarNode.newNode.value.nodeDescription"
    />
  </div>
  <div class="ml-auto flex w-full space-x-2 py-2">
    <div class="grid gap-2 mt-2">
      <Label for="nodeX">Node X</Label>
      <Input
        id="nodeX"
        type="number"
        :default-value="0"
        v-model="
          props.layout.layouts.nodes[props.sidebar.selectedNodes.value[0]].x
        "
        v-if="props.sidebar.selectedNodes.value.length > 0"
      />
      <Input
        id="nodeX"
        type="number"
        :default-value="0"
        v-model="props.sideBarNode.newNode.value.nodePosition.x"
        v-else
      />
    </div>
    <div class="grid gap-2 mt-2">
      <Label for="nodeY">Node Y</Label>
      <Input
        id="nodeY"
        :default-value="0"
        type="number"
        @update:model-value="props.sideBarNode.updateNodeYFromInput($event)"
        v-model="
          props.layout.nodes[props.sidebar.selectedNodes.value[0]].vda5050Node!
            .nodePosition.y
        "
        v-if="props.sidebar.selectedNodes.value.length > 0"
      />
      <Input
        id="nodeY"
        type="number"
        :default-value="0"
        @update:model-value="props.sideBarNode.updateNodeYFromInput($event)"
        v-else
      />
    </div>
  </div>
  <div class="grid gap-2 mt-2">
    <Label
      for="mapId"
      :class="props.sideBarNode.createFast.value ? 'text-muted-foreground' : ''"
      >Map Id</Label
    >
    <Input
      id="mapId"
      :disabled="props.sideBarNode.createFast.value"
      v-model="props.sideBarNode.newNode.value.mapId"
    />
  </div>

  <div class="grid gap-2 mt-4">
    <Label for="mapId">Connected Nodes</Label>
    <TagsInput
      class="px-0 gap-0 mt-1"
      :model-value="props.sideBarNode.nodeConnections.value"
      @update:model-value="
        props.layout.updateEdges(
          props.sideBarNode.newNode.value.nodeId,
          props.sideBarNode.nodeConnections.value,
        )
      "
    >
      <div class="flex gap-2 flex-wrap items-center px-3">
        <TagsInputItem
          v-for="item in props.sideBarNode.nodeConnections.value"
          :key="item"
          :value="item"
        >
          <TagsInputItemText />
          <TagsInputItemDelete
            @click="
              props.sideBarNode.nodeConnections.value =
                props.sideBarNode.nodeConnections.value.filter(
                  connection => connection !== item,
                );
              props.layout.deleteEdge(item);
            "
          />
        </TagsInputItem>
      </div>
      <ComboboxRoot
        v-model="frameworks"
        v-model:open="open"
        v-model:searchTerm="searchTerm"
        class="w-full"
        @keydown.esc="open = false"
      >
        <ComboboxAnchor as-child>
          <ComboboxInput placeholder="Nodes.." as-child>
            <TagsInputInput
              class="w-full px-3"
              :class="
                props.sideBarNode.nodeConnections.value.length > 0 ? 'mt-2' : ''
              "
              @keydown.enter.prevent
            />
          </ComboboxInput>
        </ComboboxAnchor>

        <ComboboxPortal>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="framework in Object.keys(layout.nodes)"
                :key="framework"
                :value="framework"
                @select.prevent="
                  ev => {
                    if (typeof ev.detail.value === 'string') {
                      searchTerm = '';
                      props.sideBarNode.nodeConnections.value.push(
                        ev.detail.value,
                      );
                      props.layout.createEdge(
                        props.sideBarNode.newNode.value.nodeId,
                        ev.detail.value,
                      );
                      open = false;
                    }

                    if (filteredFrameworks.length === 0) {
                      open = false;
                    }
                  }
                "
              >
                {{ framework }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxPortal>
      </ComboboxRoot>
    </TagsInput>
  </div>
  <div class="grid gap-2 mt-4">
    <Label for="mapId" class="text-muted-foreground"
      >Vehicle Node Properties</Label
    >
    <TagsInput
      disabled
      v-model="props.sideBarNode.newNode.value.vehicleTypeNodeProperties"
    >
      <TagsInputItem
        v-for="item in props.sideBarNode.newNode.value
          .vehicleTypeNodeProperties"
        :key="item.vehicleTypeId + '-node-properties'"
        :value="
          item.vehicleTypeId +
          (item.actions && item.actions.length > 0
            ? '->' + item.actions.map(action => action.actionType).join(',')
            : '')
        "
      >
        <TagsInputItemText />
        <TagsInputItemDelete
          @click="
            props.sideBarNode.newNode.value.vehicleTypeNodeProperties =
              props.sideBarNode.newNode.value.vehicleTypeNodeProperties.filter(
                property => property !== item,
              )
          "
        />
      </TagsInputItem>
      <VehicleNodePropertiesDialog
        :layout="props.layout"
        :side-bar-node="props.sideBarNode"
      />
    </TagsInput>
  </div>
  <div class="ml-auto flex w-full space-x-2 mt-3">
    <Button
      variant="secondary"
      @click="props.layout.createNode(props.sideBarNode.newNode.value)"
      >Save</Button
    >
    <Button
      variant="secondary"
      @click="
        props.sidebar.selectedNodes.value = [];
        props.layout.deleteNode(props.sideBarNode.newNode.value.nodeId);
      "
      >Delete</Button
    >
  </div>
</template>
