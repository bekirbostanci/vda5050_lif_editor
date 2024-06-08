<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/vue";
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="secondary">
        <Icon
          class="mr-2"
          icon="material-symbols-light:save-outline"
          :height="24"
        />
        Save
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[475px]">
      <DialogHeader>
        <DialogTitle>Save preset</DialogTitle>
        <DialogDescription>
          This will save the current playground state as a preset which you can
          access later or share with others.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input id="name" auto-focus />
        </div>
        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Input id="description" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit"> Save </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
