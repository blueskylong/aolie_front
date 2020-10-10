import DmDesignBaseView from "./DmDesignBaseView";
import {ConstraintDto} from "../../datamodel/dto/ConstraintDto";


export default class ConstraintView extends DmDesignBaseView<ConstraintDto> {
    initSubControllers(): void {
    }

    destroy(): boolean {
        return false;
    }

    protected createUI(): HTMLElement {
        return undefined;
    }

}

