import {Dialog, DialogInfo} from "../../../blockui/Dialog";
import {Alert} from "../../../uidesign/view/JQueryComponent/Alert";
import {CommonUtils} from "../../../common/CommonUtils";

export class EditorDlg extends Dialog<DialogInfo> {
    protected getBody(): HTMLElement {
        return $(require("../templates/EditorDlg.html")).get(0);
    }

    protected afterShow() {
        this.setOkButtonVisible(false);
    }

    protected beforeShow(value?: any) {
        this.$element.find("iframe")
            .attr("src", CommonUtils.getConfigParam("flowableJUIRoot")
                + "/#/editor/" + value);
    }

}
