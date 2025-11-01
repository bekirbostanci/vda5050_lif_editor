<script setup lang="ts">
import {computed, ref, onMounted, onUnmounted, watch} from 'vue';
import {LayoutController} from '@/controllers/layout.controller';
import {SideBarController} from '@/controllers/sideBar.controller';
import {SideBarNodeController} from '@/controllers/sideBarNode.controller';
import {SideBarStationController} from '@/controllers/sideBarStation.controller';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {Button} from '@/components/ui/button';

const props = defineProps<{
  layout: LayoutController;
  sideBar: SideBarController;
  sideBarNode: SideBarNodeController;
  sideBarStation: SideBarStationController;
}>();

const searchQuery = ref('');
const ITEMS_PER_PAGE = 100;
const SCROLL_THRESHOLD = 0.9; // Load more when 90% scrolled
const listContainerRef = ref<HTMLElement | null>(null);

// Initialize to show all items when no search
const visibleItemsLimit = ref(Number.MAX_SAFE_INTEGER);

// Get all stations from nodes that have vda5050Station
const allStations = computed(() => {
  return Object.entries(props.layout.nodes)
    .filter(([_, node]) => node.vda5050Station)
    .map(([nodeId, node]) => ({
      id: nodeId,
      name: node.vda5050Station!.stationName,
      description: node.vda5050Station!.stationDescription,
      type: 'station' as const,
    }));
});

// Get all nodes (excluding stations)
const allNodes = computed(() => {
  return Object.entries(props.layout.nodes)
    .filter(([_, node]) => node.vda5050Node && !node.vda5050Station)
    .map(([nodeId, node]) => ({
      id: nodeId,
      name: node.vda5050Node!.nodeName,
      description: node.vda5050Node!.nodeDescription,
      type: 'node' as const,
    }));
});

// Get all edges/paths
const allPaths = computed(() => {
  return Object.entries(props.layout.edges).map(([edgeId, edge]) => ({
    id: edgeId,
    name: edge.vda5050Edge.edgeName,
    description: edge.vda5050Edge.edgeDescription,
    type: 'path' as const,
  }));
});

// Get all layouts
const allLayouts = computed(() => {
  return props.layout.vdaLayouts.map(layout => ({
    id: layout.layoutId,
    name: layout.layoutName,
    description: layout.layoutDescription,
    type: 'layout' as const,
  }));
});

// Filter function
const filterItems = <
  T extends {id: string; name: string; description: string; type: string},
>(
  items: T[],
): T[] => {
  if (!searchQuery.value.trim()) {
    return items;
  }
  const query = searchQuery.value.toLowerCase();
  return items.filter(
    item =>
      item.id.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );
};

const filteredLayouts = computed(() => filterItems(allLayouts.value));
const filteredNodes = computed(() => filterItems(allNodes.value));
const filteredPaths = computed(() => filterItems(allPaths.value));
const filteredStations = computed(() => filterItems(allStations.value));

// Combine all items for virtual scrolling
const allItems = computed(() => {
  const items: Array<{
    id: string;
    name: string;
    description: string;
    type: 'layout' | 'node' | 'path' | 'station';
  }> = [];

  // Layouts removed from search list

  filteredNodes.value.forEach(node => {
    items.push({...node, type: 'node' as const});
  });

  filteredPaths.value.forEach(path => {
    items.push({...path, type: 'path' as const});
  });

  filteredStations.value.forEach(station => {
    items.push({...station, type: 'station' as const});
  });

  return items;
});

// Visible items with pagination
const visibleItems = computed(() => {
  return allItems.value.slice(0, visibleItemsLimit.value);
});

// Group visible items by type for display
const groupedVisibleItems = computed(() => {
  const groups: {
    nodes: typeof filteredNodes.value;
    paths: typeof filteredPaths.value;
    stations: typeof filteredStations.value;
  } = {
    nodes: [],
    paths: [],
    stations: [],
  };

  visibleItems.value.forEach(item => {
    if (item.type === 'node') {
      groups.nodes.push(item as any);
    } else if (item.type === 'path') {
      groups.paths.push(item as any);
    } else if (item.type === 'station') {
      groups.stations.push(item as any);
    }
  });

  return groups;
});

const hasMoreItems = computed(() => {
  return visibleItemsLimit.value < allItems.value.length;
});

// Handle scroll to load more items
function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;

  const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

  if (scrollPercentage >= SCROLL_THRESHOLD && hasMoreItems.value) {
    visibleItemsLimit.value = Math.min(
      visibleItemsLimit.value + ITEMS_PER_PAGE,
      allItems.value.length,
    );
  }
}

// Reset visible items when search changes
const previousSearchQuery = ref('');
watch(searchQuery, () => {
  if (previousSearchQuery.value !== searchQuery.value) {
    // If search is cleared, show all items, otherwise paginate
    if (!searchQuery.value.trim()) {
      visibleItemsLimit.value = Number.MAX_SAFE_INTEGER; // Show all when no search
    } else {
      visibleItemsLimit.value = ITEMS_PER_PAGE; // Paginate when searching
    }
    previousSearchQuery.value = searchQuery.value;
  }
});

// Handle clear search button - clear search and show all items
function handleClearSearch() {
  searchQuery.value = '';
  visibleItemsLimit.value = Number.MAX_SAFE_INTEGER; // Show all items
}

// Handle back button - clear search and reset selection
function handleBack() {
  searchQuery.value = '';
  props.sideBar.selectedNodes.value = [];
  props.sideBar.selectedEdges.value = [];
  props.sideBar.selectedStations.value = [];
  props.sideBar.setResetStates();
  visibleItemsLimit.value = Number.MAX_SAFE_INTEGER; // Show all items
}

const hasSelection = computed(() => {
  // Check search query
  if (searchQuery.value && searchQuery.value.trim().length > 0) {
    return true;
  }
  // Check selections
  if (
    props.sideBar.selectedNodes.value &&
    props.sideBar.selectedNodes.value.length > 0
  ) {
    return true;
  }
  if (
    props.sideBar.selectedEdges.value &&
    props.sideBar.selectedEdges.value.length > 0
  ) {
    return true;
  }
  if (
    props.sideBar.selectedStations.value &&
    props.sideBar.selectedStations.value.length > 0
  ) {
    return true;
  }
  return false;
});

onMounted(() => {
  if (listContainerRef.value) {
    listContainerRef.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (listContainerRef.value) {
    listContainerRef.value.removeEventListener('scroll', handleScroll);
  }
});

// Handle item selection
function handleSelect(item: {
  id: string;
  name: string;
  type: 'layout' | 'node' | 'path' | 'station';
}) {
  if (item.type === 'layout') {
    props.layout.changeLayout(item.id);
    props.sideBar.selectedLayoutId.value = item.id;
  } else if (item.type === 'node') {
    props.sideBar.selectedNodes.value = [item.id];
    if (props.layout.isVda5050Node(item.id)) {
      props.sideBar.setSelectNodeTool();
      props.sideBarNode.updateNode(item.id);
    }
  } else if (item.type === 'path') {
    props.sideBar.selectedEdges.value = [item.id];
    props.sideBar.setSelectEdgeTool();
  } else if (item.type === 'station') {
    props.sideBar.selectedNodes.value = [item.id];
    props.sideBar.selectedStations.value = [item.id];
    if (props.layout.isVda5050Station(item.id)) {
      props.sideBar.setSelectStationTool();
      props.sideBarStation.updateStation(item.id);
    }
  }
  // Set search query to item name so it displays nicely instead of the long path string
  searchQuery.value = item.name;
}
</script>

<template>
  <div
    class="flex flex-col"
    style="height: 100%; width: 100%; margin: 0; padding: 0"
  >
    <Command
      v-model="searchQuery"
      class="flex flex-col"
      style="
        height: 100%;
        width: 100%;
        border: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
      "
    >
      <div class="flex-shrink-0" style="padding: 0.5rem">
        <div
          class="flex items-center gap-2"
          style="position: relative; width: 100%"
        >
          <div class="flex-1" style="position: relative">
            <CommandInput
              placeholder="Search..."
              style="width: 100%; height: 100%"
            />
            <Button
              v-if="searchQuery && searchQuery.trim().length > 0"
              variant="ghost"
              size="sm"
              @click.stop="handleClearSearch"
              class="absolute"
              style="
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                min-width: 24px;
                height: 24px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
              "
              title="Clear search"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>
      <div
        ref="listContainerRef"
        class="flex-1"
        style="min-height: 0; overflow-y: auto; overflow-x: hidden"
        @scroll="handleScroll"
      >
        <CommandList>
          <CommandEmpty v-if="allItems.length === 0" class="opacity-50"
            >No results found.</CommandEmpty
          >

          <CommandGroup
            heading="Nodes"
            v-if="groupedVisibleItems.nodes.length > 0"
          >
            <CommandItem
              v-for="node in groupedVisibleItems.nodes"
              :key="node.id"
              :value="node.name"
              @select="handleSelect(node)"
              class="w-full"
            >
              <div class="flex flex-col w-full">
                <span class="font-medium">{{ node.name }}</span>
                <span class="text-xs text-muted-foreground">{{ node.id }}</span>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup
            heading="Paths"
            v-if="groupedVisibleItems.paths.length > 0"
          >
            <CommandItem
              v-for="path in groupedVisibleItems.paths"
              :key="path.id"
              :value="path.name"
              @select="handleSelect(path)"
              class="w-full"
            >
              <div class="flex flex-col w-full">
                <span class="font-medium">{{ path.name }}</span>
                <span class="text-xs text-muted-foreground">{{ path.id }}</span>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup
            heading="Stations"
            v-if="groupedVisibleItems.stations.length > 0"
          >
            <CommandItem
              v-for="station in groupedVisibleItems.stations"
              :key="station.id"
              :value="station.name"
              @select="handleSelect(station)"
              class="w-full"
            >
              <div class="flex flex-col w-full">
                <span class="font-medium">{{ station.name }}</span>
                <span class="text-xs text-muted-foreground">{{
                  station.id
                }}</span>
              </div>
            </CommandItem>
          </CommandGroup>

          <div
            v-if="hasMoreItems"
            class="px-2 py-2 text-xs text-muted-foreground text-center"
          >
            Showing {{ visibleItems.length }} of {{ allItems.length }} items.
            Scroll to load more...
          </div>
        </CommandList>
      </div>
    </Command>
  </div>
</template>

<style scoped>
:deep([cmdk-group]) {
  margin: 0.25rem 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep([cmdk-item]) {
  margin: 0.125rem 0.25rem !important;
  width: calc(100% - 0.5rem) !important;
  max-width: calc(100% - 0.5rem) !important;
  box-sizing: border-box !important;
}

:deep([role='presentation']) {
  padding: 0.25rem !important;
  margin: 0 !important;
  width: 100% !important;
  min-height: 100% !important;
  box-sizing: border-box !important;
  overflow-y: visible !important;
  overflow-x: hidden !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep([data-radix-combobox-content]) {
  position: relative !important;
  transform: none !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  min-height: 100% !important;
  max-height: none !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  overflow-y: visible !important;
  overflow-x: hidden !important;
}

:deep([id^='radix-vue-combobox-content']),
:deep([id*='radix-vue-combobox-content']),
:deep([class*='radix-vue-combobox-content']) {
  max-height: none !important;
  min-height: 100% !important;
  overflow-y: visible !important;
  overflow-x: hidden !important;
}

:deep([cmdk-list]) {
  width: 100% !important;
  max-width: 100% !important;
  max-height: none !important;
  min-height: 100% !important;
  overflow-y: visible !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
}

:deep([cmdk-input-wrapper]) {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  padding: 0.5rem !important;
  padding-left: calc(0.5rem + 15px) !important;
  padding-right: 2.5rem !important;
  margin: 0 !important;
  border: none !important;
  border-bottom: 1px solid hsl(var(--border)) !important;
  flex-shrink: 0 !important;
  overflow: visible !important;
  position: relative !important;
}

:deep([cmdk-input-wrapper] input) {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  padding: 0.5rem !important;
  margin: 0 !important;
  border: none !important;
  outline: none !important;
}

:deep([cmdk-input-wrapper] svg) {
  flex-shrink: 0 !important;
}

:deep([cmdk-root]) {
  height: 100% !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}
</style>
