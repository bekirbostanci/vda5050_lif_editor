<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { TopBarController } from "@/controllers/topBar.controller";
import { Icon } from "@iconify/vue";
const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
});
</script>

<template>
  <Button @click="props.topBarController.convertLifToJson(); props.topBarController.saveLifJsonFile()" variant="secondary">
    <Icon class="mr-2" icon="material-symbols-light:save-outline" :height="24" />
    Save
  </Button>
</template>
