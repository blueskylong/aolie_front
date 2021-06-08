import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {Form} from "../../blockui/Form";
import {Component} from "../../blockui/uiruntime/Component";
import {Constants} from "../../common/Constants";
import {LoginService} from "./service/LoginService";
import {Select} from "../../uidesign/view/JQueryComponent";
import {GlobalParams} from "../../common/GlobalParams";

export class SelectRole extends Dialog<DialogInfo> {
    private static FIELD_NAME = "name";
    private fRole: Form;

    protected getBody(): HTMLElement {
        let lstComp = new Array<Component>();
        lstComp.push(Form.genSimpDto(
            Constants.ComponentType.select, "选择角色", 11, SelectRole.FIELD_NAME));
        this.fRole = new Form(null);
        this.fRole.setDisplayComponent(Form.genSimpleLocalViewer(lstComp));
        return this.fRole.getViewUI();
    }

    protected beforeShow(value?: any) {
        LoginService.findUserRoles((result) => {
            let selRole = <Select<any>>this.fRole.getComponentByName(SelectRole.FIELD_NAME);
            for (let role of result) {
                selRole.addOption(role.roleId, role.roleName);
            }
            let param = {};
            if (GlobalParams.getLoginUser().getRoleDto() != null) {
                param[SelectRole.FIELD_NAME] = GlobalParams.getLoginUser().getRoleDto().roleId;
            } else {
                param[SelectRole.FIELD_NAME] = result[0]["roleId"];
            }
            this.fRole.setValue(param);
        });


    }

    public getValue() {
        return this.fRole.getValue()[SelectRole.FIELD_NAME];
    }

}
