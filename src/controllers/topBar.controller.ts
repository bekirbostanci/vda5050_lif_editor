import {ref} from 'vue';
import {LayoutController} from './layout.controller';
import {showToast} from '@/utils/general';

export class TopBarController {
  public showLifJson = ref<boolean>(false);
  public showRosJson = ref<boolean>(false);
  public showNodes = ref<boolean>(true);
  public showEdges = ref<boolean>(true);
  public showNodeLabels = ref<boolean>(true);
  public showEdgeLabels = ref<boolean>(false);
  public edgeAnimationEnabled = ref<boolean>(true);
  public showGrid = ref<boolean>(true);
  public dynamicGrid = ref<boolean>(true);
  public layoutController: LayoutController | undefined;
  constructor() {}
  public toggleLifJson() {
    if (this.layoutController) {
      this.layoutController.convertLifToJson(false);
    }
    this.showLifJson.value = true;
  }
  public toggleRosJson() {
    if (this.layoutController) {
      this.layoutController.convertLifToJson(false);
      this.layoutController.ros = this.layoutController.convertRosToJson(
        this.layoutController.lif,
      );
    }
    this.showRosJson.value = true;
  }
  public toggleMap() {
    this.showLifJson.value = false;
    this.showRosJson.value = false;
  }

  public toggleNodes() {
    this.showNodes.value = !this.showNodes.value;
  }

  public toggleEdges() {
    this.showEdges.value = !this.showEdges.value;
  }

  public toggleNodeLabels() {
    this.showNodeLabels.value = !this.showNodeLabels.value;
  }

  public toggleEdgeLabels() {
    this.showEdgeLabels.value = !this.showEdgeLabels.value;
  }

  public toggleEdgeAnimation() {
    this.edgeAnimationEnabled.value = !this.edgeAnimationEnabled.value;
  }

  public toggleGrid() {
    this.showGrid.value = !this.showGrid.value;
  }

  public toggleDynamicGrid() {
    this.dynamicGrid.value = !this.dynamicGrid.value;
  }

  public saveLifJsonFile(includeBackground: boolean) {
    if (this.layoutController) {
      this.layoutController.convertLifToJson(includeBackground);
    }
    let jsonData = this.layoutController?.lif;
    const fileName =
      'lif_file_' +
      this.layoutController?.lif.metaInformation.projectIdentification +
      '.json';

    const jsonContent = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonContent], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }

  public saveRosJsonFile() {
    if (this.layoutController) {
      this.layoutController.convertLifToJson(false);
      this.layoutController.ros = this.layoutController.convertRosToJson(
        this.layoutController.lif,
      );
    }
    let jsonData = this.layoutController?.ros;
    const fileName =
      'ros_geograph_file_' +
      this.layoutController?.lif.metaInformation.projectIdentification +
      '.json';

    const jsonContent = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonContent], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }

  selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.addEventListener('change', event => {
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
    reader.onload = event => {
      if (event.target) {
        const result = event.target.result as string;
        // Detect file format by parsing JSON and checking structure
        try {
          const parsed = JSON.parse(result);

          // Check if it's ROS GeoJSON format
          if (
            parsed.type === 'FeatureCollection' &&
            Array.isArray(parsed.features) &&
            parsed.crs
          ) {
            // ROS GeoJSON format
            this.layoutController?.convertRosGeoJsonToLif(result);
          } else if (parsed.metaInformation && Array.isArray(parsed.layouts)) {
            // LIF format
            this.layoutController?.convertJsonToLif(result);
          } else {
            console.error('Unknown file format');
            showToast(
              'Error',
              'Unknown file format. Expected LIF or ROS GeoJSON format.',
            );
          }
        } catch (error) {
          console.error('Error parsing file', error);
          showToast(
            'Error',
            'Failed to parse file. Please check the file format.',
          );
        }
      }
    };

    reader.onerror = event => {
      console.error('Error reading file', event);
    };

    reader.readAsText(file);
  }
}
