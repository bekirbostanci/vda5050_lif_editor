<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LayoutController } from "@/controllers/layout.controller";
import { SideBarController } from "@/controllers/sideBar.controller";
import { Layout } from "@/types/layout";
import { load } from 'js-yaml';

const props = defineProps({
  tools: {
    required: true,
    type: SideBarController,
  },
  layout: {
    type: LayoutController,
    required: true,
  },
});
let layout: Layout = new Object() as Layout;
createEmptyLayout();

function loadLayout() {
  const selectedLayout = props.layout.vdaLayouts.find(
    (layout) => layout.layoutId === props.tools.selectedLayoutId.value
  );
  if (selectedLayout) {
    layout = JSON.parse(JSON.stringify(selectedLayout));
  } else {
    createEmptyLayout();
  }
}

function createEmptyLayout() {
  layout = {
    layoutId: "",
    layoutName: "",
    layoutVersion: "",
    layoutLevelId: "",
    layoutDescription: "",
    nodes: [],
    edges: [],
    stations: [],
    backgroundImage: {
      image: "",
      natural_width: 0,
      natural_height: 0,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    }
  };
}
function saveLayout() {
  props.layout.saveLayout(layout);
  props.tools.selectedLayoutId.value = layout.layoutId;
}

function deleteLayout() {
  props.layout.deleteLayout(layout.layoutId);
  props.tools.selectedLayoutId.value = "";
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        const map_image = new Image();
        map_image.onload = async () => {
          // get real width and height
          const imageWidth = map_image.naturalWidth;
          const imageHeight = map_image.naturalHeight;
          // populate layout background image
          layout.backgroundImage = {
            image: map_image.src,
            x: layout.backgroundImage?.x || 0,
            y: layout.backgroundImage?.y || 0,
            width: layout.backgroundImage?.width || imageWidth,
            height: layout.backgroundImage?.height || imageHeight,
            natural_width: imageWidth,
            natural_height: imageHeight
          };
        };
        map_image.src = e.target.result as string;

        // TODO: if there is a metadata file in the same folder, it should be loaded it here
        // load_map_metadata(metadata_file);
      }
    };
    reader.readAsDataURL(file);
  }
}

function handleMetadataUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const metadata_file = input.files[0];
    load_map_metadata(metadata_file);
  };
}

function load_map_metadata(metadata_file: File) {
  if (!layout.backgroundImage.image) {
    console.error("Cannot load map metadata, background image is not set.");
    return
  }
  if (metadata_file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const yamlText = reader.result as string;
        const parsedData = load(yamlText);
        // Extract resolution and origin from the parsed data
        if (parsedData?.resolution && parsedData?.origin) {
          layout.backgroundImage.x = parsedData.origin[0]
          layout.backgroundImage.y = parsedData.origin[1]
          layout.backgroundImage.width = parsedData.resolution * layout.backgroundImage.natural_width;
          layout.backgroundImage.height = parsedData.resolution * layout.backgroundImage.natural_height;
        } else {
          console.error("Failed to extract resolution and origin from map metadata.");
        }
        
      } catch (error) {
        console.error("Error parsing YAML map metadata file:", error);
      }
    };
    reader.readAsText(metadata_file);
  };
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <div class="grid grid-cols-2 gap-2 w-full">
        <Button variant="secondary" @click="createEmptyLayout()" class="w-full">
          <Icon class="mr-2" icon="ph:plus-circle-thin" :height="24" />
          Create
        </Button>
        <Button variant="secondary" @click="loadLayout()" class="w-full">
          <Icon class="mr-2" icon="ph:layout-thin" :height="24" />
          Edit
        </Button>
      </div>
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
          <HoverCard :open-delay="2000">
            <HoverCardTrigger>
              <Label for="layoutId">Layout Id</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              Unique identifier for this layout.
            </HoverCardContent>
          </HoverCard>
          <Input id="layoutId" v-model="layout.layoutId" auto-focus />
        </div>
        <div class="grid gap-2">
          <HoverCard :open-delay="2000">
            <HoverCardTrigger>
              <Label for="layoutName">Layout Name</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              Human-readable name of the layout (e.g., for displaying).
            </HoverCardContent>
          </HoverCard>
          <Input id="layoutName" v-model="layout.layoutName" auto-focus />
        </div>
        <div class="grid gap-2">
          <HoverCard :open-delay="2000">
            <HoverCardTrigger>
              <Label for="layoutVersion">Layout Version</Label>
            </HoverCardTrigger>
            <HoverCardContent> Version of the layout. </HoverCardContent>
          </HoverCard>
          <Input id="layoutVersion" v-model="layout.layoutVersion" auto-focus />
        </div>
        <div class="grid gap-2">
          <HoverCard :open-delay="2000">
            <HoverCardTrigger>
              <Label for="layoutLevelId">Layout Level Id</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              This attribute can be used to explicitly indicate which level or
              floor within a building or buildings a layout represents in a
              situation where there are multiple, such as multiple levels in the
              same facility, or two disconnected areas in the same facility.
            </HoverCardContent>
          </HoverCard>
          <Input
            id="layoutLevelId"
            v-model="layout.layoutLevelId"
            auto-Level
            Id
          />
        </div>
        <div class="grid gap-2">
          <HoverCard :open-delay="2000">
            <HoverCardTrigger>
              <Label for="layoutDescription">Layout Description</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              Brief description of the layout.
            </HoverCardContent>
          </HoverCard>
          <Input
            id="layoutDescription"
            v-model="layout.layoutDescription"
            auto-focus
          />
        </div>
        <div class="grid gap-2">
          <HoverCard :open-delay="2000">
            <HoverCardTrigger>
              <Label for="backgroundImage">Background Image</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              Select an image file to use as the background for the network graph.
            </HoverCardContent>
          </HoverCard>
          <Input
            id="backgroundImage"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            auto-focus
          />
        </div>
        <div class="grid gap-2" v-if="layout.backgroundImage">
          <HoverCard :open-delay="2000">
            <HoverCardTrigger>
              <Label for="mapMetadata">Map metadata</Label>
            </HoverCardTrigger>
            <HoverCardContent>
              Select a YAML file to load map metadata. The file should contain
              'origin' and 'resolution' fields.
            </HoverCardContent>
          </HoverCard>
          <Input
            id="mapMetadata"
            type="file"
            accept=".yaml,.yml"
            @change="handleMetadataUpload"
            auto-focus
          />
        </div>
        <div class="grid grid-cols-2 gap-4" v-if="layout.backgroundImage">
          <div class="grid gap-2">
            <HoverCard :open-delay="2000">
              <HoverCardTrigger>
                <Label for="backgroundX">Background X Position</Label>
              </HoverCardTrigger>
              <HoverCardContent>
                X coordinate of the background image position
              </HoverCardContent>
            </HoverCard>
            <Input
              id="backgroundX"
              type="number"
              v-model="layout.backgroundImage.x"
              auto-focus
            />
          </div>
          <div class="grid gap-2">
            <HoverCard :open-delay="2000">
              <HoverCardTrigger>
                <Label for="backgroundY">Background Y Position</Label>
              </HoverCardTrigger>
              <HoverCardContent>
                Y coordinate of the background image position
              </HoverCardContent>
            </HoverCard>
            <Input
              id="backgroundY"
              type="number"
              v-model="layout.backgroundImage.y"
              auto-focus
            />
          </div>

          <div class="grid gap-2">
            <HoverCard :open-delay="2000">
              <HoverCardTrigger>
                <Label for="backgroundWidth">Background Width</Label>
              </HoverCardTrigger>
              <HoverCardContent>
                Width of the background image in pixels
              </HoverCardContent>
            </HoverCard>
            <Input
              id="backgroundWidth"
              type="number"
              v-model="layout.backgroundImage.width"
              auto-focus
            />
          </div>

          <div class="grid gap-2">
            <HoverCard :open-delay="2000">
              <HoverCardTrigger>
                <Label for="backgroundHeight">Background Height</Label>
              </HoverCardTrigger>
              <HoverCardContent>
                Height of the background image in pixels
              </HoverCardContent>
            </HoverCard>
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
