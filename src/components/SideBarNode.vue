<script setup lang="ts">
/* Third Party */
import { computed, ref, toRaw } from "vue";

/* Components */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tools } from "@/controllers/tools";

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
import { Layout } from "@/controllers/layout";

const props = defineProps<{
  tools: Tools;
  layout: Layout;
}>();

console.log(Object.values(toRaw(props.layout.nodes)));

const frameworks = Object.values(toRaw(props.layout.nodes)).map((node) => ({
  value: node["name"],
  label: node["name"],
}));

const modelValue = ref<string[]>([]);
const open = ref(false);
const searchTerm = ref("");

const filteredFrameworks = computed(() =>
  frameworks.filter((i) => !modelValue.value.includes(i.label))
);
</script>
<template>
  <div class="grid gap-2 mt-2">
    <HoverCard>
      <HoverCardTrigger>
        <Label for="nodeId">Node Id</Label>
      </HoverCardTrigger>
      <HoverCardContent>
        Unique identifier of the node across all layouts contained in this LIF
        file.
      </HoverCardContent>
    </HoverCard>
    <Input id="nodeId" Node Id />
  </div>
  <div class="grid gap-2 mt-2">
    <HoverCard>
      <HoverCardTrigger>
        <Label for="nodeName">Node Name</Label>
      </HoverCardTrigger>
      <HoverCardContent
        >Unique identifier of the node across all layouts contained in this LIF
        file.
      </HoverCardContent>
    </HoverCard>
    <Input id="nodeName" />
  </div>
  <div class="grid gap-2 mt-2">
    <HoverCard>
      <HoverCardTrigger>
        <Label for="nodeDescription">Node Description</Label>
      </HoverCardTrigger>
      <HoverCardContent
        >Brief description of the node. This should only ever be for
        visualization or diagnostic purposes.
      </HoverCardContent>
    </HoverCard>
    <Input id="nodeDescription" />
  </div>
  <div class="grid gap-2 mt-2">
    <HoverCard>
      <HoverCardTrigger>
        <Label for="mapId">Map Id</Label>
      </HoverCardTrigger>
      <HoverCardContent>
        Unique identification of the map in which the node oder node‘s position
        is referenced. Each map has the same project specific global origin of
        coordinates. When a vehicle uses an elevator, e.g., leading from a
        departure floor to a target floor, it will disappear off the map of the
        departure floor and spawn in the related lift node on the map of the
        target floor.</HoverCardContent
      >
    </HoverCard>
    <Input id="mapId" />
  </div>

  <div class="grid gap-2 mt-2">
    <Label for="mapId">Connected Nodes</Label>
    <TagsInput class="px-0 gap-0" :model-value="modelValue">
      <div class="flex gap-2 flex-wrap items-center px-3">
        <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      </div>

      <ComboboxRoot
        v-model="modelValue"
        v-model:open="open"
        v-model:searchTerm="searchTerm"
        class="w-full"
      >
        <ComboboxAnchor as-child>
          <ComboboxInput placeholder="Nodes.." as-child>
            <TagsInputInput
              class="w-full px-3"
              :class="modelValue.length > 0 ? 'mt-2' : ''"
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
                v-for="framework in filteredFrameworks"
                :key="framework.value"
                :value="framework.label"
                @select.prevent="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      searchTerm = '';
                      modelValue.push(ev.detail.value);
                    }

                    if (filteredFrameworks.length === 0) {
                      open = false;
                    }
                  }
                "
              >
                {{ framework.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxPortal>
      </ComboboxRoot>
    </TagsInput>
  </div>
  <div class="ml-auto flex w-full space-x-2 mt-3">
    <Button variant="secondary">Save</Button>
    <Button variant="secondary">Delete</Button>
  </div>
</template>
