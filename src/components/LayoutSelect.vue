<script setup lang="ts">
import { LayoutController } from "@/controllers/layout.controller";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ToolController } from "@/controllers/tool.controller";
const props = defineProps({
  layout: {
    required: true,
    type: LayoutController
  },
  tools: {
    type: ToolController,
    required: true
  }
})
props.tools.selectedLayoutId.value = props.layout.vdaLayouts[0].layoutId;
props.layout.changeLayout(props.tools.selectedLayoutId.value);
</script>

<template>
  <Select v-model="props.tools.selectedLayoutId.value"  @update:model-value="props.layout.changeLayout(props.tools.selectedLayoutId.value)">
    <SelectTrigger>
      <SelectValue placeholder="Select Layout"></SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="layout in props.layout?.vdaLayouts" :value="layout.layoutId">{{layout.layoutName}}</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
