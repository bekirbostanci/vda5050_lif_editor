<script setup lang="ts">
/* Components */
import LayoutDialog from "./LayoutDialog.vue";
import LayoutSelect from "./LayoutSelect.vue";
import MetaInformationDialog from "./MetaInformationDialog.vue";
import configs from "@/utils/GraphConfig";
import { Separator } from "./ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { LayoutController } from "@/controllers/layout.controller";
import { SideBarController } from "@/controllers/sideBar.controller";
import { SideBarNodeController } from "@/controllers/sideBarNode.controller";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SideBarStationController } from "@/controllers/sideBarStation.controller";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const props = defineProps<{
  layout: LayoutController;
  sideBar: SideBarController;
  sideBarNode: SideBarNodeController;
  sideBarStation: SideBarStationController;
}>();
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div class="grid gap-2 space-y-2" v-if="props.sideBar.selectedLayoutId.value != ''">
      <HoverCard :open-delay="2000">
        <HoverCardTrigger as-child>
          <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Create Item
          </span>
          <Tabs default-value="account" class="w-100">
            <TabsList class="grid grid-cols-3">
              <TabsTrigger value="node"
                @click="props.sideBar.selectedNodes.value = []; props.sideBarNode.cleanNodeInputs(); props.sideBar.setCreateNodeState();">
                Node
              </TabsTrigger>
              <TabsTrigger value="station"
                @click="props.sideBar.selectedStations.value = []; props.sideBarStation.cleanStationInputs(); props.sideBar.setCreateStationState()">
                Station
              </TabsTrigger>
              <TabsTrigger value="action">
                Action
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </HoverCardTrigger>
        <HoverCardContent class="w-[320px] text-sm" side="left">
          Use to add a new node or station to the layout
        </HoverCardContent>
      </HoverCard>
    </div>
    <Separator orientation="horizontal" />
    <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      Meta Information
    </span>
    <MetaInformationDialog :layout="props.layout"></MetaInformationDialog>
    <Separator orientation="horizontal" />
    <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      Layout
    </span>
    <LayoutDialog :layout="props.layout" :tools="props.sideBar"></LayoutDialog>
    <LayoutSelect :layout="props.layout" :tools="props.sideBar"></LayoutSelect>

    <Separator orientation="horizontal" />
    <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      Visibility
    </span>
    <div class="flex">
      <ToggleGroup type="multiple" variant="outline">
        <ToggleGroupItem value="visible" aria-label="Toggle bold"
          @click="configs.node.label.visible = !configs.node.label.visible">
          Node
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic"
          @click="configs.edge.label.visible = !configs.edge.label.visible">
          Edge
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

  </div>
</template>
