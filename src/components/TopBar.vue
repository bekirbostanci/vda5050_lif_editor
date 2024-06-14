<script setup lang="ts">
import PresetActions from "../components/PresetActions.vue";
import PresentOpen from "./PresentOpen.vue";
import PresentShow from "./PresentShow.vue";
import PresentSave from "./PresetSave.vue"

import { TopBarController } from "@/controllers/topBar.controller";
const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
});
</script>

<template>
  <div
    class="ml-4 mr-4 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
    <h2 class="text-lg font-semibold" style="width: 200px">VDA LIF Editor</h2>
    <div class="ml-auto flex w-full space-x-2 sm:justify-end">
      <PresentOpen :top-bar-controller="props.topBarController" />
      <PresentSave :top-bar-controller="props.topBarController" />
      <PresentShow :top-bar-controller="props.topBarController" />
      <PresetActions />
    </div>
  </div>
</template>
