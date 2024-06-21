<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    TagsInput,
    TagsInputItem,
    TagsInputInput,
    TagsInputItemDelete,
    TagsInputItemText,
} from "@/components/ui/tags-input";
import { LayoutController } from "@/controllers/layout.controller";
import { SideBarNodeController } from "@/controllers/sideBarNode.controller";
import { VehicleTypeNodeProperty } from "@/types/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Ref, ref } from "vue";

const props = defineProps({
    sideBarNode: {
        type: SideBarNodeController,
        required: true
    },
    layout: {
        type: LayoutController,
        required: true
    }
});
const vehicleTypeNodeProperties: Ref<VehicleTypeNodeProperty> = ref<VehicleTypeNodeProperty>({
    actions: [],
    theta: 0,
    vehicleTypeId: ''
});
</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <div class="inline-flex ml-auto">
                <Icon class="" icon="ic:baseline-plus" :height="20" />
            </div>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[475px]">
            <DialogHeader>
                <DialogTitle>Vehicle Node Properties</DialogTitle>
                <DialogDescription>
                    Vehicle type specific properties for this node.
                    This attribute must not be empty. There must be
                    an element for each vehicle type that may use
                    this node. If no element exists for a particular
                    vehicle type, the (third-party) master control sys-
                    tem must consider that node invalid for use with
                    that vehicle type.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid gap-2">
                    <div class="grid gap-2 mt-4">
                        <Label for="vehicle-id">Vehicle Id</Label>
                        <Input id="vehicle-id" v-model="vehicleTypeNodeProperties.vehicleTypeId" />
                    </div>
                    <div class="grid gap-2 mt-4">
                        <Label for="theta">Theta</Label>
                        <Input id="theta" type="number" v-model="vehicleTypeNodeProperties.theta" />
                    </div>
                </div>
                <div class="grid gap-2">
                    <Label for="mapId">Actions</Label>
                    <TagsInput disabled>
                        <TagsInputItem v-for="item in vehicleTypeNodeProperties.actions"
                            :key="item.actionType + '-vehicle-node-properties-action'" :value="item.actionType">
                            <TagsInputItemText />
                            <TagsInputItemDelete
                                @click="vehicleTypeNodeProperties.actions = vehicleTypeNodeProperties.actions?.filter(action => action.actionType !== item.actionType)" />
                        </TagsInputItem>
                        <TagsInputInput placeholder="Actions..." />
                    </TagsInput>
                    <Select @update:model-value="{
                        const action = props.layout.actions.find(action => action.actionType === $event);
                        if (action && !vehicleTypeNodeProperties.actions?.find(item => item.actionType === action.actionType)) {
                            vehicleTypeNodeProperties.actions?.push(action);
                        }
                    }">
                        <SelectTrigger>
                            <SelectValue placeholder="Add new action..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem v-for="action in props.layout.actions" :value="action.actionType"
                                    :key="action.actionType.toString()">
                                    {{ action.actionType }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <DialogClose as-child>
                    <Button type="submit" variant="secondary"
                        :disabled="vehicleTypeNodeProperties.vehicleTypeId === ''"
                        @click="props.sideBarNode.newNode.value.vehicleTypeNodeProperties.push(vehicleTypeNodeProperties)">Add</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
