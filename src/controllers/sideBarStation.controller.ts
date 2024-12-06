import {Station} from '@/types/layout';
import {ref} from 'vue';
import {LayoutController} from './layout.controller';

export class SideBarStationController {
  newStation = ref<Station>({
    stationId: '',
    stationName: '',
    interactionNodeIds: [],
    stationDescription: '',
    stationHeight: 0,
    stationPosition: {
      x: 0,
      y: 0,
      theta: 0,
    },
  });
  public nodeConnections = ref<string[]>([]);
  constructor(private layoutController: LayoutController) {}
  cleanStationInputs() {
    this.newStation.value = {
      stationId: '',
      stationName: '',
      interactionNodeIds: [],
      stationDescription: '',
      stationHeight: 0,
      stationPosition: {
        x: 0,
        y: 0,
        theta: 0,
      },
    };
  }

  updateStationYFromInput(stationY: any) {
    // Revert y coordinate when update station coordinate from input
    if (this.layoutController.layouts.nodes[this.newStation.value.stationId]) {
      this.layoutController.layouts.nodes[this.newStation.value.stationId].y =
        parseFloat(stationY) * -1;
    }
    this.updateStationY(stationY);
  }

  updateStationY(stationY: any) {
    // Revert y coordinate when station position changed
    if (this.layoutController.nodes[this.newStation.value.stationId]) {
      this.layoutController.nodes[
        this.newStation.value.stationId
      ].vda5050Station!.stationPosition.y = stationY * -1;
    }

    this.newStation.value.stationPosition.y = stationY * -1;
  }

  updateStation(selectedStation: string) {
    if (
      !this.layoutController.nodes ||
      !this.layoutController.nodes[selectedStation].vda5050Station
    ) {
      return;
    }

    if (selectedStation) {
      this.layoutController.nodes[selectedStation].draggable = true;
    }
    this.newStation.value.stationDescription =
      this.layoutController.nodes[
        selectedStation
      ].vda5050Station!.stationDescription;
    this.newStation.value.stationName =
      this.layoutController.nodes[selectedStation].vda5050Station!.stationName;
    this.newStation.value.stationId =
      this.layoutController.nodes[selectedStation].vda5050Station!.stationId;
    this.newStation.value.stationPosition =
      this.layoutController.nodes[
        selectedStation
      ].vda5050Station!.stationPosition;
    this.newStation.value.interactionNodeIds =
      this.layoutController.nodes[
        selectedStation
      ].vda5050Station!.interactionNodeIds;
  }
}
