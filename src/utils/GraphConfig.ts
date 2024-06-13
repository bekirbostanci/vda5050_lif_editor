import { defineConfigs } from "v-network-graph";

const configs = defineConfigs({
  node: {
    draggable: node => node.draggable,
    selectable: 1, // up to 2 nodes
    zOrder: {
      zIndex: (node) => node.zIndex,
    },
    normal: {
      type: "circle",
      radius: 15,
      color: (node) => node.color,
    },
    hover: {
      color: "black",
    },
    label: {
      directionAutoAdjustment: true,
      visible: true,
      fontSize: 15,
    },
  },
  edge: {
    selectable: 1, // up to 2 nodes
    gap: 12,
    normal: {
      width: 3,
      color: "gray",
      dasharray: "20 16",
      animate: true,
      animationSpeed: 20,
    },
    label: {
      fontSize: 15,
    },
    selfLoop: {
      radius: 25,
    },
    hover: {
      color: "black",
    },
    marker: {
      target: {
        type: "angle",
        width: 4,
        height: 4,
        margin: -1,
        offset: 0,
        units: "strokeWidth",
        color: null,
      },
    },
  },
  view: {
    maxZoomLevel: 200,
    grid: {
      visible: true,
      interval: 1,
      thickIncrements: 4,
      line: {
        color: "#e0e0e0",
        dasharray: 1,
      },
    },
  },
});

export default configs;
