<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { TopBarController } from "@/controllers/topBar.controller";
import { Icon } from "@iconify/vue";
const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  }, ghost: {
    type: Boolean,
    default: false,
  }
});
</script>

<template>
  <Button :variant="props.ghost ? 'ghost' : 'secondary'"
    @click="props.topBarController.convertLifToJson(); props.topBarController.saveLifJsonFile()" >
    <Icon class="mr-2" icon="material-symbols-light:save-outline" :height="24" />
    Save
  </Button>
</template>
