<script setup lang="ts">
import {ref} from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {TextAlignJustifyIcon} from '@radix-icons/vue';
import {TopBarController} from '@/controllers/topBar.controller';
import {Button} from '@/components/ui/button';
const open = ref(false);

const props = defineProps({
  topBarController: {
    type: TopBarController,
    required: true,
  },
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary">
        <TextAlignJustifyIcon></TextAlignJustifyIcon>
        <span class="sr-only">Actions</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @select="open = true">
        <PresentOpen
          :ghost="true"
          :top-bar-controller="props.topBarController"
        />
      </DropdownMenuItem>
      <DropdownMenuItem @select="open = true">
        <PresentSave
          :ghost="true"
          :top-bar-controller="props.topBarController"
        />
      </DropdownMenuItem>
      <DropdownMenuItem @select="open = true">
        <PresentShow
          :ghost="true"
          :top-bar-controller="props.topBarController"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
