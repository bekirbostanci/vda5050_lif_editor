<script setup lang="ts">
import LifEditor from './views/LifEditor.vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
import {Analytics} from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <Toaster />
  <LifEditor></LifEditor>
</template>

<style scoped></style>
