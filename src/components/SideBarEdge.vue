<script setup lang="ts">
/* Components */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SideBarController } from "@/controllers/sideBar.controller";
import { LayoutController } from "@/controllers/layout.controller";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { SideBarNodeController } from "@/controllers/sideBarNode.controller";

const props = defineProps<{
    sidebar: SideBarController;
    layout: LayoutController;
    sideBarNode: SideBarNodeController;
}>();

</script>
<template>
    <div v-if="props.sidebar.selectedEdges.value[0]">
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
                v-model="props.sidebar.selectedEdges.value[0]" />
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
            <Input id="edge-name" v-model="props.layout.edges[props.sidebar.selectedEdges.value[0]].vda5050.edgeName" />
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
            <Input id="edge-description"
                v-model="props.layout.edges[props.sidebar.selectedEdges.value[0]].vda5050.edgeDescription" />
        </div>
        <div class="ml-auto flex w-full space-x-2 py-2">
            <div class="grid gap-2 mt-2">
                <Label for="nodeX">Start Node Id</Label>
                <Input id="nodeX" :default-value="props.layout.edges[props.sidebar.selectedEdges.value[0]].source" />
            </div>
            <div class="grid gap-2 mt-2">
                <Label for="nodeY">End Node Id</Label>
                <Input id="nodeY" :default-value="props.layout.edges[props.sidebar.selectedEdges.value[0]].target" />
            </div>
        </div>
        <div class="ml-auto flex w-full space-x-2 mt-3">
            <Button variant="secondary"
                @click="props.layout.deleteEdge(props.sidebar.selectedEdges.value[0])">Delete</Button>
        </div>
    </div>
</template>
