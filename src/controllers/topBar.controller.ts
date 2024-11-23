import { ref } from "vue";
import { LayoutController } from "./layout.controller";

export class TopBarController {
  public showJson = ref<boolean>(false);
  public layoutController: LayoutController | undefined;
  constructor() {}
  public toggleJson() {
    this.convertLifToJson();
    this.showJson.value = !this.showJson.value;
  }

  public convertLifToJson() {
    if (this.layoutController) {
      this.layoutController.convertLifToJson();
    }
  }

  public saveLifJsonFile(background: boolean = true) {
    const jsonData = this.layoutController?.lif;
    const fileName =
      "lif_file_" +
      this.layoutController?.lif.metaInformation.projectIdentification +
      ".json";
    
    const jsonContent = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonContent], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }

  selectFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.files) {
        const file = target.files[0];
        this.readFile(file);
      }
    });

    input.click();
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const result = event.target.result as string;
        this.layoutController?.convertJsonToLif(result);
      }
    };

    reader.onerror = (event) => {
      console.error("Error reading file", event);
    };

    reader.readAsText(file);
  }
}
