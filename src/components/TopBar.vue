<script setup lang="ts">
import PresentOpen from "./PresentOpen.vue";
import PresentShow from "./PresentShow.vue";
import PresentSave from "./PresetSave.vue"
import { Separator } from "../components/ui/separator";

import { TopBarController } from "@/controllers/topBar.controller";
const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
});
</script>

<template>
  <div id="top-bar" class="sticky top-0 ">
    <div
      class="pl-4 pr-4 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
      <h2 class="text-lg font-semibold" style="width: 200px">VDA LIF Editor</h2>
      <div class="ml-auto flex w-full space-x-2 sm:justify-end">
        <PresentOpen :top-bar-controller="props.topBarController" />
        <PresentSave :top-bar-controller="props.topBarController" />
        <PresentShow :top-bar-controller="props.topBarController" />

      </div>
    </div>
    <Separator></Separator>
  </div>
</template>
<style>
#top-bar {
  background-color: white;
  z-index: 10;
}
</style>