<script setup lang="ts">
import {TopBarController} from '@/controllers/topBar.controller';
import NetworkGraph from '../components/NetworkGraph.vue';
import TopBar from '@/components/TopBar.vue';
import ToolBar from '@/components/ToolBar.vue';
import FooterBar from '@/components/FooterBar.vue';
import {ref} from 'vue';

const topBarController = new TopBarController();
const networkGraphRef = ref();
</script>

<template>
  <div class="h-full flex-col md:flex">
    <TopBar :top-bar-controller="topBarController"></TopBar>
    <ToolBar
      :layout="networkGraphRef?.layoutController"
      :sideBar="networkGraphRef?.sideBarController"
      :sideBarNode="networkGraphRef?.sideBarNodeController"
      :sideBarStation="networkGraphRef?.sideBarStationController"
    ></ToolBar>
    <div class="h-full flex-1">
      <NetworkGraph
        ref="networkGraphRef"
        :top-bar-controller="topBarController"
      ></NetworkGraph>
    </div>
  </div>
  <FooterBar
    class="fixed bottom-0 left-0 w-full"
    :layout-controller="networkGraphRef?.layoutController"
  >
  </FooterBar>
</template>
