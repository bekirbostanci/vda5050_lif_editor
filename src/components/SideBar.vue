<script setup lang="ts">
/* Components */
import LayoutDialog from "./LayoutDialog.vue";
import LayoutSelect from "./LayoutSelect.vue";
import MetaInformationDialog from "./MetaInformationDialog.vue";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Layout } from "@/controllers/layout";
import { Tools } from "@/controllers/tools";

const props = defineProps<{
  layout: Layout;
  tools: Tools;
}>();
</script>

<template>
  <div class="hidden flex-col space-y-4 sm:flex md:order-2">
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
    <LayoutDialog></LayoutDialog>
    <LayoutSelect></LayoutSelect>

    <Separator orientation="horizontal" />
    <div class="grid gap-2">
      <HoverCard :open-delay="200">
        <HoverCardTrigger as-child>
          <span
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Create Item
          </span>
          <div class="ml-auto flex w-full space-x-2">
            <Button variant="secondary" @click="props.tools.setCreateNodeState();"
              >Node</Button
            >
            <Button variant="secondary" @click="props.tools.setCreateStationState();">Station</Button>
          </div>
        </HoverCardTrigger>
        <HoverCardContent class="w-[320px] text-sm" side="left">
          Use to add a new node or station to the layout
        </HoverCardContent>
      </HoverCard>
    </div>
  </div>
</template>
