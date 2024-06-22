import { ToolState } from "@/types/ToolState";
import { ref } from "vue";

export class SideBarController {
  private createNode = ref<boolean>(false);
  private createStation = ref<boolean>(false);
  public selectedNodes = ref<string[]>([]);
  public selectedEdges = ref<string[]>([]);
  public selectedStations = ref<string[]>([]);
  public toolState = ref<ToolState>(ToolState.createNode);
  public selectedLayoutId = ref<string>("");

  setResetStates() {
    this.createNode.value = false;
    this.createStation.value = false;
    this.toolState.value = ToolState.empty;
  }

  setCreateNodeState() {
    this.setResetStates();
    this.createNode.value = true;
    this.toolState.value = ToolState.createNode;
  }

  setCrudAction(){
    this.setResetStates();
    this.toolState.value = ToolState.crudAction;
  }

  setCreateStationState() {
    this.setResetStates();
    this.createStation.value = true;
    this.toolState.value = ToolState.createStation;
  }

  public setSelectNodeTool() {
    this.toolState.value = ToolState.selectNode;
  }
  public setSelectStationTool() {
    this.setResetStates();
    this.toolState.value = ToolState.createStation;
  }

  public setSelectEdgeTool() {
    this.toolState.value = ToolState.selectEdge;
  }
  public isCreateOrSelectNodeTool() {
  return (
    this.toolState.value == ToolState.createNode ||
    this.toolState.value == ToolState.selectNode
  );
}
}
