import FormulaDto from "../../datamodel/dto/FormulaDto";
import DmDesignBaseView from "./DmDesignBaseView";

export default class FormulaView extends DmDesignBaseView<FormulaDto> {
    initSubControls(): void {
    }

    destroy(): boolean {
        return false;
    }

    createUI(): HTMLElement {
        return undefined;
    }
}
