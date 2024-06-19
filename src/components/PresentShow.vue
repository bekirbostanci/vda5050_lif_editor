<script setup lang="ts">
import { TopBarController } from "@/controllers/topBar.controller";
import { Button } from "./ui/button";
import { Icon } from "@iconify/vue";
const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
  ghost: {
    type: Boolean,
    default: false,
  }
});
</script>

<template>
  <Button :variant="props.ghost ? 'ghost' : 'secondary'"
    @click="props.topBarController.toggleJson()">
    <Icon class="mr-2" icon="ph:code-light" :height="20" />
    {{ props.topBarController.showJson.value ? "Show Diagram" : "Show Code" }}
  </Button>
</template>
