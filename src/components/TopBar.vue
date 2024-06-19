<script setup lang="ts">
import PresentOpen from "./PresentOpen.vue";
import PresentShow from "./PresentShow.vue";
import PresentSave from "./PresetSave.vue"
import PresentActions from "./PresetActions.vue"
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
    <div class="p-4 flex w-full">
      <h2 class="text-lg font-semibold" style="width: 200px">VDA LIF Editor</h2>
      <div class="hide-on-mobile ml-auto flex w-full space-x-2 justify-end">
        <PresentOpen :top-bar-controller="props.topBarController" />
        <PresentSave :top-bar-controller="props.topBarController" />
        <PresentShow :top-bar-controller="props.topBarController" />
      </div>
      <div class="hide-on-desktop ml-auto flex w-full space-x-2 justify-end">
        <PresentActions :top-bar-controller="props.topBarController" />
      </div>

    </div>
    <Separator></Separator>
  </div>
</template>
<style scoped>
#top-bar {
  background-color: white;
  z-index: 10;
}

@media (min-width: 768px) {
  .hide-on-desktop {
    display: none;
  }

}

@media (max-width: 767px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>