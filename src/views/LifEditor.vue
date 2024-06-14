<script setup lang="ts">
import { TopBarController } from "@/controllers/topBar.controller";
import NetworkGraph from "../components/NetworkGraph.vue";
import { Separator } from "../components/ui/separator";

import TopBar from "@/components/TopBar.vue";
const topBarController = new TopBarController();
</script>

<template>
  <div class="h-full flex-col md:flex">
    <TopBar :top-bar-controller="topBarController"></TopBar>
    <Separator />
    <div class="ml-4 mr-4 h-full py-6 flex-1">
      <NetworkGraph :top-bar-controller="topBarController"></NetworkGraph>
    </div>
  </div>
</template>
