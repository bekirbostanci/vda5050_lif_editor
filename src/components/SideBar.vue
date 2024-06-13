<script setup lang="ts">
/* Components */
import LayoutDialog from "./LayoutDialog.vue";
import LayoutSelect from "./LayoutSelect.vue";
import MetaInformationDialog from "./MetaInformationDialog.vue";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { LayoutController } from "@/controllers/layout.controller";
import { ToolController } from "@/controllers/tool.controller";
import { SideBarNodeController } from "@/controllers/sideBarNode.controller";

const props = defineProps<{
  layout: LayoutController;
  tools: ToolController;
  sideBarNode: SideBarNodeController;
}>();
</script>

<template>
  <div class="flex-col space-y-4">
    <span
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Meta Information
    </span>
    <MetaInformationDialog></MetaInformationDialog>
    <Separator orientation="horizontal" />
    <span
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Layout
    </span>
    <LayoutDialog :layout="props.layout" :tools="props.tools"></LayoutDialog>
    <LayoutSelect :layout="props.layout" :tools="props.tools"></LayoutSelect>

    <div class="grid gap-2 space-y-2" v-if="props.tools.selectedLayoutId.value != ''">
      <Separator orientation="horizontal" />
      <HoverCard :open-delay="2000">
        <HoverCardTrigger as-child>
          <span
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Create Item
          </span>
          <div class="ml-auto flex w-full space-x-2">
            <Button
              variant="secondary"
              @click="props.sideBarNode.cleanNodeInputs(); props.tools.setCreateNodeState();"
              >Node</Button
            >
            <Button
              variant="secondary"
              @click="props.tools.setCreateStationState()"
              >Station</Button
            >
          </div>
        </HoverCardTrigger>
        <HoverCardContent class="w-[320px] text-sm" side="left">
          Use to add a new node or station to the layout
        </HoverCardContent>
      </HoverCard>
    </div>
  </div>
</template>
