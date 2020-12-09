import {JsTree, JsTreeInfo} from "./JsTree";
import {GlobalParams} from "../../common/GlobalParams";
import {UiService} from "../service/UiService";
import {CommonUtils} from "../../common/CommonUtils";
import {BaseComponent} from "../../uidesign/view/BaseComponent";
import {ReferenceDto} from "../../datamodel/dto/ReferenceDto";

/**
 * 设计生成的树
 */
export class ReferenceTree<T extends ReferenceTreeInfo> extends BaseComponent<T> {
    private jsTree: JsTree<any>;
    private refDto: ReferenceDto;
    private canLoadData = false;

    static getTreeInstance(reference, version?) {
        let refInfo = {refId: reference, version: version || GlobalParams.getLoginVersion()};
        let tree = new ReferenceTree(refInfo);
        return tree;
    }

    getReferenceName() {
        return this.refDto.refName;
    }

    getTree() {
        return this.jsTree;
    }

    async initSubControllers() {
        if (!this.refDto) {
            this.refDto = await UiService.getReferenceDto(this.properties.refId) as any;
        }
        if (!this.refDto) {
            console.log("Reference " + this.properties.refId + " not exists!")
        }

        let jsTreeInfo = this.genTreeInfo();
        jsTreeInfo.rootName = this.refDto.refName;
        jsTreeInfo.showSearch = true;
        jsTreeInfo.url = () => {
            if (!this.canLoadData) {
                return null;
            }
            return "/ui/findReferenceData/" + this.properties.refId;
        };
        this.jsTree = new JsTree<any>(jsTreeInfo);
        this.$element.append(this.jsTree.getViewUI());

    }

    afterComponentAssemble(): void {
        CommonUtils.readyDo(() => {
            return !!this.jsTree
        }, () => {
            this.jsTree.afterComponentAssemble();
        });
    }

    private genTreeInfo(): JsTreeInfo {

        return {idField: "id", codeField: "code", textField: "name"};

    }

    reload() {
        this.canLoadData = true;
        this.jsTree.reload();
    }

    protected createUI(): HTMLElement {
        return $("<div class='full-display'></div>").get(0);
    }

    getValue(): any {
        this.jsTree.getValue();
    }

    setEditable(editable: boolean) {
        this.jsTree.setEditable(editable);
    }

    setEnable(enable: boolean) {
        this.jsTree.setEnable(enable);
    }

    setValue(value: any) {
        this.jsTree.setValue(value);
    }

    destroy(): boolean {
        this.jsTree.destroy();
        this.refDto = null;
        return super.destroy();
    }
}

export interface ReferenceTreeInfo {
    refId: number;
    version?: string;
}
