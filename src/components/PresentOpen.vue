<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
</script>

<template>
  <Button variant="secondary">
    <Icon
      class="mr-2"
      icon="material-symbols-light:file-open-outline"
      :height="20"
    />
    Open
  </Button>
</template>
