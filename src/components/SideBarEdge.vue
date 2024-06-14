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

const props = defineProps<{
    sidebar: SideBarController;
    layout: LayoutController;
    sideBarNode: SideBarNodeController;
}>();
const open = ref(false);
const searchTerm = ref("");

const frameworks = Object.values(toRaw(props.layout.nodes)).map((node) => ({
    value: node.vda5050.nodeId,
    label: node.vda5050.nodeId,
}));

const filteredFrameworks = computed(() =>
    frameworks.filter(
        (i) => !props.sideBarNode.nodeConnections.value.includes(i.label)
    )
);
</script>
<template>
    <div class="grid gap-2 mt-2">
        <HoverCard :open-delay="2000">
            <HoverCardTrigger>
                <Label for="edge-id">Edge Id</Label>
            </HoverCardTrigger>
            <HoverCardContent>Unique identifier of the node across all layouts contained in this LIF
                file.
            </HoverCardContent>
        </HoverCard>
        <Input id="edge-id" :disabled="props.sideBarNode.createFast.value"
            v-model="props.sideBarNode.newNode.value.nodeName" />
    </div>
    <div class="grid gap-2 mt-2">
        <HoverCard :open-delay="2000">
            <HoverCardTrigger>
                <Label for="edge-name">Edge Name</Label>
            </HoverCardTrigger>
            <HoverCardContent>Unique identifier of the node across all layouts contained in this LIF
                file.
            </HoverCardContent>
        </HoverCard>
        <Input id="edge-name" :disabled="props.sideBarNode.createFast.value"
            v-model="props.sideBarNode.newNode.value.nodeName" />
    </div>
    <div class="grid gap-2 mt-2">
        <HoverCard :open-delay="2000">
            <HoverCardTrigger>
                <Label for="edge-description">Edge Description</Label>
            </HoverCardTrigger>
            <HoverCardContent>Unique identifier of the node across all layouts contained in this LIF
                file.
            </HoverCardContent>
        </HoverCard>
        <Input id="edge-description" :disabled="props.sideBarNode.createFast.value"
            v-model="props.sideBarNode.newNode.value.nodeName" />
    </div>
    <div class="ml-auto flex w-full space-x-2 py-2">
        <div class="grid gap-2 mt-2">
            <Label for="nodeX">Start Node Id</Label>
            <Input id="nodeX" :default-value="0" />
        </div>
        <div class="grid gap-2 mt-2">
            <Label for="nodeY">End Node Id</Label>
            <Input id="nodeY" :default-value="0" />
        </div>
    </div>
    <div class="ml-auto flex w-full space-x-2 mt-3">
        <Button variant="secondary" @click="props.layout.createNode(props.sideBarNode.newNode.value)">Save</Button>
        <Button variant="secondary"
            @click="props.layout.deleteNode(props.sideBarNode.newNode.value.nodeId)">Delete</Button>
    </div>
</template>
