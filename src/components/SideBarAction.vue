<script setup lang="ts">
import {ref} from 'vue';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Action, RequirementType} from '@/types/layout';
import {BlockingType} from 'vda-5050-lib/common/vda-5050-types';

import {Button} from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';

import {LayoutController} from '@/controllers/layout.controller';

const props = defineProps({
  layout: {
    type: LayoutController,
    required: true,
  },
});
const open = ref(false);
const selectedAction = ref<string>('');

const requirementOptions = [
  'REQUIRED',
  'CONDITIONAL',
  'OPTIONAL',
] as RequirementType[];
const blockingOptions = Object.values(BlockingType);

const actionParameterKey = ref('');
const actionParameterValue = ref('');

const newAction = ref<Action>({
  actionType: '',
  actionDescription: '',
  requirementType: 'REQUIRED',
  blockingType: 'HARD',
  actionParameters: [],
});

function clearAction() {
  newAction.value = {
    actionType: '',
    actionDescription: '',
    requirementType: 'REQUIRED',
    blockingType: 'HARD',
    actionParameters: [],
  };
  selectedAction.value = '';
}
</script>
<template>
  <Popover v-model:open="open" v-if="props.layout.actions.length > 0">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between"
      >
        {{ selectedAction ? selectedAction : 'Select action...' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Search action..." />
        <CommandEmpty>No action found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="action in props.layout.actions"
              :key="action.actionType"
              :value="action.actionType"
              @select="
                ev => {
                  if (typeof ev.detail.value === 'string') {
                    selectedAction = ev.detail.value;

                    const foundAction = props.layout.actions.find(
                      action => action.actionType == ev.detail.value,
                    );
                    if (foundAction) {
                      newAction = JSON.parse(JSON.stringify(foundAction));
                    }
                  }
                  open = false;
                }
              "
            >
              {{ action.actionType }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>

  <div class="grid gap-2 mt-2">
    <Label for="action-type">Action Type</Label>
    <Input id="action-type" v-model="newAction.actionType" />
  </div>
  <div class="grid gap-2 mt-2">
    <Label for="action-description">Action Description</Label>
    <Input id="action-description" v-model="newAction.actionDescription" />
  </div>
  <div class="grid gap-2 mt-2">
    <Label for="action-type" class="text-muted-foreground"
      >Action Parameters</Label
    >
    <TagsInput v-model="newAction.actionParameters" disabled>
      <TagsInputItem
        v-for="item in Object.values(newAction.actionParameters)"
        :key="item.key"
        :value="item.key + ' : ' + item.value"
      >
        <TagsInputItemText />
        <TagsInputItemDelete
          @click="
            newAction.actionParameters = newAction.actionParameters.filter(
              parameter => parameter !== item,
            )
          "
        />
      </TagsInputItem>
      <TagsInputInput />
    </TagsInput>
  </div>
  <div class="ml-auto flex w-full space-x-2 py-2">
    <div class="grid gap-2 mt-2">
      <Label for="action-parameter-key">Key</Label>
      <Input id="action-parameter-key" v-model="actionParameterKey" />
    </div>
    <div class="grid gap-2 mt-2">
      <Label for="action-parameter-value">Value</Label>
      <Input id="action-parameter-value" v-model="actionParameterValue" />
    </div>
    <div class="grid gap-2 mt-7">
      <Button
        variant="secondary"
        @click="
          newAction.actionParameters.push({
            key: actionParameterKey,
            value: actionParameterValue,
          });
          actionParameterKey = '';
          actionParameterValue = '';
        "
        >Add</Button
      >
    </div>
  </div>
  <div class="grid gap-2 mt-4">
    <Label class="mb-2">Action Requirement</Label>
    <RadioGroup v-model="newAction.requirementType">
      <div
        class="flex items-center space-x-2"
        v-for="option in requirementOptions"
        :key="option"
      >
        <RadioGroupItem
          :id="option + 'requirement'"
          :value="option"
          v-model="newAction.requirementType"
        />
        <Label :for="option + 'requirement'">{{ option }}</Label>
      </div>
    </RadioGroup>
  </div>
  <div class="grid gap-2 mt-4">
    <Label class="mb-2">Blocking Type</Label>
    <RadioGroup v-model="newAction.blockingType">
      <div
        class="flex items-center space-x-2"
        v-for="option in blockingOptions"
        :key="option"
      >
        <RadioGroupItem
          :id="option + 'blocking-type'"
          :value="option"
          v-model="newAction.blockingType"
        />
        <Label :for="option + 'blocking-type'">{{ option }}</Label>
      </div>
    </RadioGroup>
  </div>
  <div class="ml-auto flex w-full space-x-2 mt-3">
    <Button
      variant="secondary"
      @click="
        props.layout.createAction(newAction);
        clearAction();
      "
      >Save</Button
    >
    <Button
      variant="secondary"
      @click="
        props.layout.deleteAction(newAction);
        clearAction();
      "
      >Delete</Button
    >
  </div>
</template>
