<script setup lang="ts">
import NetworkGraph from "../components/NetworkGraph.vue";
import { Separator } from "../components/ui/separator";

import TopBar from "@/components/TopBar.vue";
</script>

<template>
  <div class="h-full flex-col md:flex">
    <TopBar></TopBar>
    <Separator />
    <div class="ml-4 mr-4 h-full py-6 flex-1">
      <NetworkGraph></NetworkGraph>
    </div>
  </div>
</template>
