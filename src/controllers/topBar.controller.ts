import { ref } from "vue";
import { LayoutController } from "./layout.controller";

export class TopBarController{
    public showJson = ref<boolean>(false)
    public layoutController: LayoutController | undefined; 
    constructor() {
    }

    public toggleJson() {
        if(this.layoutController) {
            this.layoutController.prepareLif();
        };

        this.showJson.value = !this.showJson.value;

    }
}