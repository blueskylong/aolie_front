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

    static getTreeInstance(reference, version?, isMulti?) {
        let refInfo = {refId: reference, version: version || GlobalParams.getLoginVersion(), isMulti: isMulti};
        let tree = new ReferenceTree(refInfo);
        return tree;
    }

    getReferenceName() {
        return this.refDto.refName;
    }

    getTree() {
        return this.jsTree;
    }

    /**
     * 切换显示的引用数据
     * @param refId
     */
    async changeRefId(refId, onReady?: () => void) {
        if (this.properties.refId == refId) {
            return;
        }
        this.properties.refId = refId;
        this.clearShow();
        await this.initSubControllers();
        if (onReady) {
            this.addReadyListener(onReady);
        }
        this.reload();
    }

    private clearShow() {
        this.jsTree.destroy();
        this.$element.children().remove();
    }

    async initSubControllers() {
        if (this.properties.refId >= 0) {
            if (!this.refDto) {
                this.refDto = await UiService.getReferenceDto(this.properties.refId) as any;
            }
            if (!this.refDto) {
                console.log("Reference " + this.properties.refId + " not exists!")
            }
        }
        let jsTreeInfo = this.genTreeInfo();
        jsTreeInfo.rootName = this.properties.refId < 0 ? "未指定引用" : this.refDto.refName;
        jsTreeInfo.showSearch = true;
        jsTreeInfo.url = () => {
            if (!this.canLoadData || this.properties.refId < 0) {
                return null;
            }
            return "/ui/findReferenceData/" + this.properties.refId;
        };
        this.jsTree = new JsTree<any>(jsTreeInfo);
        this.$element.append(this.jsTree.getViewUI());
        this.jsTree.addReadyListener(() => {
            this.fireReadyEvent();
            this.jsTree.setEditable(this.editable);
        })

    }

    private genTreeInfo(): JsTreeInfo {
        return {idField: "id", codeField: "code", textField: "name", multiSelect: this.properties.isMulti};
    }

    reload() {
        CommonUtils.readyDo(() => {
            return this.isReady();
        }, () => {
            this.canLoadData = true;
            this.jsTree.reload();
        });

    }

    protected createUI(): HTMLElement {
        return ReferenceTree.createFullPanel("reference-tree")
            .get(0);
    }

    getValue(): any {
        this.jsTree.getValue();
    }

    setEditable(editable: boolean) {
        this.jsTree.setEditable(editable);
        super.setEditable(editable);
        super.setEnable(editable);
    }

    setEnable(enable: boolean) {
        this.jsTree.setEnable(enable);
        super.setEnable(enable);
        super.setEditable(enable);
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
    isMulti?: boolean;
}
