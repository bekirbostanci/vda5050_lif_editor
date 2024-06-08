<script setup lang="ts">
import PresetActions from "../components/PresetActions.vue";
import PresetSave from "../components/PresetSave.vue";
import PresetSelector from "../components/PresetSelector.vue";
import PresetShare from "../components/PresetShare.vue";
import CodeViewer from "../components/CodeViewer.vue";
import PresentOpen from "./PresentOpen.vue";
</script>

<template>
  <div
    class="ml-4 mr-4 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16"
  >
    <h2 class="text-lg font-semibold" style="width: 200px">VDA LIF Editor</h2>
    <div class="ml-auto flex w-full space-x-2 sm:justify-end">
      <PresetSelector presets="{presets}" />
      <PresentOpen />
      <PresetSave />
      <div class="hidden space-x-2 md:flex">
        <CodeViewer />
        <PresetShare />
      </div>
      <PresetActions />
    </div>
  </div>
</template>
