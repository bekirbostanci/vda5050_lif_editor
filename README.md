# VDA5050 LIF Editor

The LIF format editor application is an application that you can edit the LIF file for vda5050 compatible robots. With the application you can design the nodes that the robots will move. Nodes can also be connected with the help of edges. Actions can be added on nodes and edges. Stations can also be added to the fiber file with LIF format.

![vda](./docs/VDA%20Lif%20Editor.gif)
![map_image](./docs/Map%20Image.png)

## Live Demo

Check out the live demo of this project [here](https://vda5050-lif-editor.vercel.app/).

## What is VDA5050 LIF Format

The Layout Interchange Format (LIF) aims to standardize the definition of automated vehicle track layouts for third-party master control system providers. Its primary goal is to support the VDA 5050 interface in decoupling vehicle manufacturers from third-party control systems by using the same terminology and structure. The LIF maps necessary information to help a third-party control system navigate a vehicle on a specified track layout. It also ensures clear responsibility separation between vehicle integrators and third-party control systems.

Document reference : [here](https://vdma.org/documents/34570/3317035/FuI_Guideline_LIF_GB.pdf/779bc75c-9525-8d13-412e-fff82bc6ab39?t=1710513623026).

## Features

- Node operations (create, update, delete)
- Edge operations (create, update, delete)
- Fast node creator (automatically create node and edge when click on graph)
- Station operations
- Multi layout
- Export and import lif files
- Actions management

## Install

Before than run app, please go to folder and install npm packages

```
npm install
```

## Run

```
npm run dev
```

## TODO

- [x] Node
  - [x] Nodes create
  - [x] Nodes edit
  - [x] Node connection another layout
- [ ] Edge
  - [x] Edges create
  - [ ] Edges edit
  - [ ] vehicleTypeEdgeProperties
- [x] Station
  - [x] Station create
  - [x] Station edit
- [x] Action
  - [x] Action create
  - [x] Action edit
  - [x] Define actionParameters
