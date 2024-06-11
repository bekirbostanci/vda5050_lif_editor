<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
</script>

<template>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select Layout" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="layout_1">Layout 1</SelectItem>
        <SelectItem value="layout_2">Layout 2</SelectItem>
        <SelectItem value="layout_3">Layout 3</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
