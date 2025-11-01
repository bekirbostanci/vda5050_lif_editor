<script setup lang="ts">
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {LayoutController} from '@/controllers/layout.controller';
import {SideBarController} from '@/controllers/sideBar.controller';
import {Layout} from '@/types/layout';
import {MapMetadata} from '@/types/visualizationLayout';
import {load} from 'js-yaml';
import {ref, Ref, watch} from 'vue';

const props = defineProps({
  tools: {
    required: false,
    type: SideBarController,
  },
  layout: {
    type: LayoutController,
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String as () => 'create' | 'edit',
    default: 'create',
  },
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const isOpen = ref(props.open);
watch(
  [() => props.open, () => props.mode],
  ([newOpen, newMode]) => {
    isOpen.value = newOpen;
    if (newOpen) {
      if (newMode === 'create') {
        createEmptyLayout();
      } else {
        loadLayout();
      }
    }
  },
  {immediate: true},
);

const layout: Ref<Layout> = ref({} as Layout);
createEmptyLayout();

function loadLayout() {
  if (!props.tools) {
    createEmptyLayout();
    return;
  }
  const selectedLayoutId = props.tools.selectedLayoutId.value;
  if (!selectedLayoutId) {
    createEmptyLayout();
    return;
  }
  const selectedLayout = props.layout.vdaLayouts.find(
    layout => layout.layoutId === selectedLayoutId,
  );
  if (selectedLayout) {
    layout.value = JSON.parse(JSON.stringify(selectedLayout));
  } else {
    createEmptyLayout();
  }
}

function createEmptyLayout() {
  layout.value = {
    layoutId: '',
    layoutName: '',
    layoutVersion: '',
    layoutLevelId: '',
    layoutDescription: '',
    nodes: [],
    edges: [],
    stations: [],
    backgroundImage: {
      image: '',
      naturalWidth: 0,
      naturalHeight: 0,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    },
  };
}
function saveLayout() {
  props.layout.saveLayout(layout.value);
  if (props.tools) {
    props.tools.selectedLayoutId.value = layout.value.layoutId;
  }
  emit('update:open', false);
}

function deleteLayout() {
  props.layout.deleteLayout(layout.value.layoutId);
  if (props.tools) {
    props.tools.selectedLayoutId.value = '';
  }
  emit('update:open', false);
}

/**
 * Upload map image (background image) file and visualize it
 *
 * @param event
 */
function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      if (e.target?.result) {
        const mapImage = new Image();
        mapImage.onload = async () => {
          // get real width and height
          const imageWidth = mapImage.naturalWidth;
          const imageHeight = mapImage.naturalHeight;
          // populate layout background image
          layout.value.backgroundImage = {
            image: mapImage.src,
            x: layout.value.backgroundImage?.x || 0,
            y: layout.value.backgroundImage?.y || 0,
            width: layout.value.backgroundImage?.width || imageWidth,
            height: layout.value.backgroundImage?.height || imageHeight,
            naturalWidth: imageWidth,
            naturalHeight: imageHeight,
          };
        };
        mapImage.src = e.target.result as string;

        // TODO: if there is a metadata file in the same folder, it should be loaded it here
        // loadMapMetadata(metadata_file);
      }
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Upload map metadata file
 * @param event
 */
function handleMetadataUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const metadata = input.files[0];
    loadMapMetadata(metadata);
  }
}

/**
 * Use ros map meta file for background image size and position
 * @param metadata_file file of type application/yaml containing map meta data
 * see https://github.com/ros-perception/map_msgs/blob/master/map_msgs/msg/MapMetaData.msg
 */
function loadMapMetadata(metadata_file: File) {
  if (!layout.value.backgroundImage?.image) {
    return;
  }
  if (metadata_file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const yamlText = reader.result as string;
        const parsedData = load(yamlText);
        const mapMetadata: MapMetadata = parsedData as MapMetadata;

        // Extract resolution and origin from the parsed data
        if (
          layout?.value.backgroundImage &&
          mapMetadata?.resolution &&
          mapMetadata?.origin
        ) {
          props.layout.backgroundImage.value.x = mapMetadata.origin[0];
          props.layout.backgroundImage.value.y = mapMetadata.origin[1];
          props.layout.backgroundImage.value.width =
            mapMetadata.resolution * layout.value.backgroundImage.naturalWidth;
          props.layout.backgroundImage.value.height =
            mapMetadata.resolution *
            props.layout.backgroundImage.value.naturalHeight;

          // Update layout dialog data
          layout.value.backgroundImage = props.layout.backgroundImage.value;
        } else {
          console.error(
            'Failed to extract resolution and origin from map metadata.',
          );
        }
      } catch (error) {
        console.error('Error parsing YAML map metadata file:', error);
      }
    };
    reader.readAsText(metadata_file);
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('update:open', $event)">
    <DialogTrigger as-child v-if="$slots.default && !props.open">
      <slot></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[475px]">
      <DialogHeader>
        <DialogTitle>Layout</DialogTitle>
        <DialogDescription>
          Collection of layouts used in the facility by the driverless transport
          system. All layouts geometrically refer to the same project-specific
          global origin..
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="layoutId">Layout Id</Label>
          <Input id="layoutId" v-model="layout.layoutId" auto-focus />
        </div>
        <div class="grid gap-2">
          <Label for="layoutName">Layout Name</Label>
          <Input id="layoutName" v-model="layout.layoutName" auto-focus />
        </div>
        <div class="grid gap-2">
          <Label for="layoutVersion">Layout Version</Label>
          <Input id="layoutVersion" v-model="layout.layoutVersion" auto-focus />
        </div>
        <div class="grid gap-2">
          <Label for="layoutLevelId">Layout Level Id</Label>
          <Input
            id="layoutLevelId"
            v-model="layout.layoutLevelId"
            auto-Level
            Id
          />
        </div>
        <div class="grid gap-2">
          <Label for="layoutDescription">Layout Description</Label>
          <Input
            id="layoutDescription"
            v-model="layout.layoutDescription"
            auto-focus
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label for="backgroundImage">Background Image</Label>
            <Input
              id="backgroundImage"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              auto-focus
            />
          </div>
          <div>
            <Label for="mapMetadata">Map metadata</Label>
            <Input
              id="mapMetadata"
              type="file"
              accept=".yaml,.yml"
              @change="handleMetadataUpload"
              auto-focus
            />
          </div>
        </div>
        <div
          class="grid grid-cols-2 gap-4"
          v-if="layout.backgroundImage?.image"
        >
          <div class="grid gap-2">
            <Label for="backgroundX">Background X Position</Label>
            <Input
              id="backgroundX"
              type="number"
              v-model="layout.backgroundImage.x"
              auto-focus
            />
          </div>
          <div class="grid gap-2">
            <Label for="backgroundY">Background Y Position</Label>
            <Input
              id="backgroundY"
              type="number"
              v-model="layout.backgroundImage.y"
              auto-focus
            />
          </div>

          <div class="grid gap-2">
            <Label for="backgroundWidth">Background Width</Label>
            <Input
              id="backgroundWidth"
              type="number"
              v-model="layout.backgroundImage.width"
              auto-focus
            />
          </div>

          <div class="grid gap-2">
            <Label for="backgroundHeight">Background Height</Label>
            <Input
              id="backgroundHeight"
              type="number"
              v-model="layout.backgroundImage.height"
              auto-focus
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          <Button @click="saveLayout()"> Save </Button>
          <Button class="ml-2" @click="deleteLayout()"> Delete </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
