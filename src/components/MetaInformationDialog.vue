<script setup lang="ts">
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {Icon} from '@iconify/vue';
import {LayoutController} from '@/controllers/layout.controller';
const props = defineProps<{
  layout: LayoutController;
}>();
function getFormattedDate(): string {
  const date = new Date();
  return date.toISOString();
}
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
        Meta Information
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[475px]">
      <DialogHeader>
        <DialogTitle>LIF Meta Information</DialogTitle>
        <DialogDescription>
          Meta information is the initial section containing general information
          about the created LIF file.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <HoverCard>
            <HoverCardTrigger>
              <Label for="projectIdentification">Project Identification</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              Human-readable name of the project
            </HoverCardContent>
          </HoverCard>
          <Input
            id="projectIdentification"
            v-model="props.layout.lif.metaInformation.projectIdentification"
            auto-focus
          />
        </div>
        <div class="grid gap-2">
          <HoverCard>
            <HoverCardTrigger>
              <Label for="creator">Creator</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              Creator of the LIF file (e.g., name of company, or name of
              person).
            </HoverCardContent>
          </HoverCard>
          <Input
            id="creator"
            v-model="props.layout.lif.metaInformation.creator"
            auto-focus
          />
        </div>
        <div class="grid gap-2">
          <HoverCard>
            <HoverCardTrigger>
              <Label for="lifVersion">Lif Version</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              Version of LIF: [Major].[Minor].[Patch] (0.11.0).
            </HoverCardContent>
          </HoverCard>
          <Input
            id="lifVersion"
            v-model="props.layout.lif.metaInformation.lifVersion"
            auto-focus
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button
            type="submit"
            @click="
              props.layout.lif.metaInformation.exportTimestamp =
                getFormattedDate()
            "
          >
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
