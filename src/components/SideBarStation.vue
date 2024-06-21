<script setup lang="ts">
/* Third Party */
import { computed, ref, toRaw } from "vue";

/* Components */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { SideBarStationController } from "@/controllers/sideBarStation.controller";

const props = defineProps<{
    sidebar: SideBarController;
    sidebarStation: SideBarStationController;
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
        (i) => !props.sidebarStation.nodeConnections.value.includes(i.label)
    )
);
</script>
<template>
    <div>
        <div class="grid gap-2 mt-2">
            <div class="flex items-center">
                <Label for="stationId">Station Id</Label>
            </div>
            <HoverCard :open-delay="2000">
                <HoverCardTrigger>
                </HoverCardTrigger>
                <HoverCardContent>
                    Unique identifier of the node across all layouts contained in this LIF
                    file.
                </HoverCardContent>
            </HoverCard>
            <Input id="stationId" v-model="props.sidebarStation.newStation.value.stationId" />
        </div>
        <div class="grid gap-2 mt-2">
            <HoverCard :open-delay="2000">
                <HoverCardTrigger>
                    <Label for="stationName">Station Name</Label>
                </HoverCardTrigger>
                <HoverCardContent>Unique identifier of the node across all layouts contained in this LIF
                    file.
                </HoverCardContent>
            </HoverCard>
            <Input id="stationName" v-model="props.sidebarStation.newStation.value.stationName" />
        </div>
        <div class="grid gap-2 mt-2">
            <HoverCard :close-delay="0" :open-delay="2000">
                <HoverCardTrigger>
                    <Label for="stationDescription">Station Description</Label>
                </HoverCardTrigger>
                <HoverCardContent>Brief description of the node. This should only ever be for
                    visualization or diagnostic purposes.
                </HoverCardContent>
            </HoverCard>
            <Input id="stationDescription" v-model="props.sidebarStation.newStation.value.stationDescription" />
        </div>
        <div class="ml-auto flex w-full space-x-2 py-2">
            <div class="grid gap-2 mt-2" v-if="props.sidebar.selectedStations.value.length > 0">
                <Label for="station-x">Station X</Label>
                <Input id="station-x" type="number"
                    v-model="props.layout.layouts.nodes[props.sidebar.selectedStations.value[0]].x"
                    :default-value="0" />
            </div>
            <div class="grid gap-2 mt-2" v-else>
                <Label for="station-x">Station X</Label>
                <Input id="station-x" type="number" v-model="props.sidebarStation.newStation.value.stationPosition.x"
                    :default-value="0" />
            </div>
            <div class="grid gap-2 mt-2" v-if="props.sidebar.selectedStations.value.length > 0">
                <Label for="station-y">Station Y</Label>
                <Input id="station-y" type="number" :default-value="0"
                    @update:model-value="props.sidebarStation.updateStationYFromInput($event)"
                    v-model="props.layout.nodes[props.sidebar.selectedStations.value[0]].vda5050Station!.stationPosition.y" />
            </div>
            <div class="grid gap-2 mt-2" v-else>
                <Label for="station-y">Station Y</Label>
                <Input id="station-y" type="number"  @update:model-value="props.sidebarStation.updateStationYFromInput($event)"
                    :default-value="0" />
            </div>
            <div class="grid gap-2 mt-2">
                <Label for="station-theta">Station Theta</Label>
                <Input id="station-theta" type="number"
                    v-model="props.sidebarStation.newStation.value.stationPosition.theta" :default-value="0" />
            </div>

        </div>
        <div class="grid gap-2 mt-2">
            <HoverCard :open-delay="2000">
                <HoverCardTrigger>
                    <Label for="station-height">Station Height</Label>
                </HoverCardTrigger>
                <HoverCardContent>
                    Unique identification of the map in which the node oder node‘s position
                    is referenced. Each map has the same project specific global origin of
                    coordinates. When a vehicle uses an elevator, e.g., leading from a
                    departure floor to a target floor, it will disappear off the map of the
                    departure floor and spawn in the related lift node on the map of the
                    target floor.</HoverCardContent>
            </HoverCard>
            <Input id="station-height" v-model="props.sidebarStation.newStation.value.stationHeight" default-value="0" type="number"/>
        </div>

        <div class="grid gap-2 mt-4">
            <Label>Interaction Nodes</Label>
            <TagsInput class="px-0 gap-0 mt-1" :model-value="props.sidebarStation.nodeConnections.value"
                @update:model-value="props.sidebarStation.newStation.value.interactionNodeIds = props.sidebarStation.nodeConnections.value;">
                <div class="flex gap-2 flex-wrap items-center px-3">
                    <TagsInputItem v-for="item in props.sidebarStation.nodeConnections.value" :key="item" :value="item">
                        <TagsInputItemText />
                        <TagsInputItemDelete />
                    </TagsInputItem>
                </div>
                <ComboboxRoot v-model="props.sideBarNode.nodeConnections.value" v-model:open="open"
                    v-model:searchTerm="searchTerm" class="w-full">
                    <ComboboxAnchor as-child>
                        <ComboboxInput placeholder="Nodes.." as-child>
                            <TagsInputInput class="w-full px-3" :class="props.sidebarStation.nodeConnections.value.length > 0 ? 'mt-2' : ''
                                " @keydown.enter.prevent />
                        </ComboboxInput>
                    </ComboboxAnchor>

                    <ComboboxPortal>
                        <CommandList position="popper"
                            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                            <CommandEmpty />
                            <CommandGroup>
                                <CommandItem v-for="framework in filteredFrameworks" :key="framework.value"
                                    :value="framework.label" @select.prevent="(ev) => {
                                        if (typeof ev.detail.value === 'string') {
                                            searchTerm = '';
                                            props.sidebarStation.nodeConnections.value.push(
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
        <div class="ml-auto flex w-full space-x-2 mt-3">
            <Button variant="secondary"
                @click="props.layout.createStation(props.sidebarStation.newStation.value)">Save</Button>
            <Button variant="secondary" :disabled="!props.sidebarStation.newStation.value.stationId"
                @click="props.sidebar.selectedStations.value = []; props.layout.deleteNode(props.sidebarStation.newStation.value.stationId)">Delete</Button>
        </div>
    </div>
</template>
