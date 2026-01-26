# VDA5050 LIF Editor

The LIF format editor application is an application that you can edit the LIF file for vda5050 compatible robots. With the application you can design the nodes that the robots will move. Nodes can also be connected with the help of edges. Actions can be added on nodes and edges. Stations can also be added to the LIF file.

This project supports generating and exporting **both** formats from the same graph/layout: **VDA5050 LIF** and **ROS2 Nav2 Route Server GeoJSON**.

<img src="./docs/VDA%20Lif%20Editor.gif" width="100%" />

![map_image](./docs/Map%20Image.png)

## Live Demo

Check out the live demo of this project [here](https://vda5050-lif-editor.vercel.app/).

## What is VDA5050 LIF Format

The Layout Interchange Format (LIF) aims to standardize the definition of automated vehicle track layouts for third-party master control system providers. Its primary goal is to support the VDA 5050 interface in decoupling vehicle manufacturers from third-party control systems by using the same terminology and structure. The LIF maps necessary information to help a third-party control system navigate a vehicle on a specified track layout. It also ensures clear responsibility separation between vehicle integrators and third-party control systems.

Document reference : [here](https://vdma.org/documents/34570/3317035/FuI_Guideline_LIF_GB.pdf/779bc75c-9525-8d13-412e-fff82bc6ab39?t=1710513623026).

## What is Nav2 Route Graph

This editor is officially referenced in the [Nav2 documentation](https://docs.nav2.org/tutorials/docs/route_server_tools/route_graph_generation_lif_editor.html) as a tool for generating route graphs for the Nav2 Route Server.

### GeoJSON Export for Nav2

The VDA LIF Editor can generate and export route graphs in GeoJSON format (Nav2 Route Server) **while also maintaining the VDA5050 LIF representation**. This allows you to:

- Design node layouts visually with your floor plan as a background
- Create edges between nodes to define robot navigation paths
- Export the graph as **GeoJSON** for use with Nav2 Route Server
- Export the same graph as **LIF** for later editing / interchange

### Tutorial

For a complete tutorial on using this editor with Nav2, visit the official Nav2 documentation:
[Route Graph Generation LIF Editor](https://docs.nav2.org/tutorials/docs/route_server_tools/route_graph_generation_lif_editor.html)

## Features

- Node operations (create, update, delete)
- Edge operations (create, update, delete)
- Fast node creator (automatically create node and edge when click on graph)
- Station operations
- Multi layout
- Export and import lif files
- Actions management
- Trajectory and edge actions  
- Export to GeoJSON for ROS2 Nav2 Route Server

## Install

Before than run app, please go to folder and install npm packages

```
npm install
```

## Run

```
npm run dev
```
