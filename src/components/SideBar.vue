<script setup lang="ts">
/* Components */
import LayoutDialog from './LayoutDialog.vue';
import LayoutSelect from './LayoutSelect.vue';
import MetaInformationDialog from './MetaInformationDialog.vue';
import configs from '@/utils/graphConfig';
import {Separator} from './ui/separator';
import {HoverCard, HoverCardTrigger} from './ui/hover-card';
import {LayoutController} from '@/controllers/layout.controller';
import {SideBarController} from '@/controllers/sideBar.controller';
import {SideBarNodeController} from '@/controllers/sideBarNode.controller';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';
import {SideBarStationController} from '@/controllers/sideBarStation.controller';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';

const props = defineProps<{
  layout: LayoutController;
  sideBar: SideBarController;
  sideBarNode: SideBarNodeController;
  sideBarStation: SideBarStationController;
}>();
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div
      class="grid gap-2 space-y-2"
      v-if="props.sideBar.selectedLayoutId.value != ''"
    >
      <HoverCard :open-delay="2000">
        <HoverCardTrigger as-child>
          <span
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Create Item
          </span>
          <Tabs default-value="create-node" class="w-100">
            <TabsList class="grid grid-cols-3">
              <TabsTrigger
                value="create-node"
                @click="
                  props.sideBar.selectedNodes.value = [];
                  props.sideBarNode.cleanNodeInputs();
                  props.sideBar.setCreateNodeState();
                "
              >
                Node
              </TabsTrigger>
              <TabsTrigger
                value="create-station"
                @click="
                  props.sideBar.selectedStations.value = [];
                  props.sideBarStation.cleanStationInputs();
                  props.sideBar.setCreateStationState();
                "
              >
                Station
              </TabsTrigger>
              <TabsTrigger
                value="create-action"
                @click="props.sideBar.setCrudAction()"
              >
                Action
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </HoverCardTrigger>
      </HoverCard>
    </div>
    <Separator orientation="horizontal" />
    <span
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Meta Information
    </span>
    <MetaInformationDialog :layout="props.layout"></MetaInformationDialog>
    <Separator orientation="horizontal" />
    <span
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Layout
    </span>
    <LayoutDialog :layout="props.layout" :tools="props.sideBar"></LayoutDialog>
    <LayoutSelect :layout="props.layout" :tools="props.sideBar"></LayoutSelect>

    <Separator orientation="horizontal" />
    <span
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Visibility
    </span>
    <div class="flex">
      <ToggleGroup type="multiple" variant="outline">
        <ToggleGroupItem
          value="visible-node-label"
          @click="configs.node.label.visible = !configs.node.label.visible"
        >
          Node
        </ToggleGroupItem>
        <ToggleGroupItem
          value="visible-edge-label"
          @click="configs.edge.label.visible = !configs.edge.label.visible"
        >
          Edge
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  </div>
</template>
