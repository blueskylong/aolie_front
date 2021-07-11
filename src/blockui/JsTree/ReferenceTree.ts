import {JsTree, JsTreeInfo, Node} from "./JsTree";
import {GlobalParams} from "../../common/GlobalParams";
import {UiService} from "../service/UiService";
import {CommonUtils} from "../../common/CommonUtils";
import {BaseComponent} from "../../uidesign/view/BaseComponent";
import {ReferenceDto} from "../../datamodel/dto/ReferenceDto";
import {GeneralEventListener} from "../event/GeneralEventListener";

/**
 * 设计生成的树
 */
export class ReferenceTree<T extends ReferenceTreeInfo> extends BaseComponent<T> {
    private jsTree: JsTree<any>;
    private refDto: ReferenceDto;
    private canLoadData = false;
    private selectedListener: Array<GeneralEventListener> = new Array<GeneralEventListener>();

    static getTreeInstance(reference, version?, isMulti?) {
        let refInfo = {refId: reference, version: version || GlobalParams.getLoginVersion(), isMulti: isMulti};
        return  new ReferenceTree(refInfo);
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
        await this.initSubControls();
        if (onReady) {
            this.addReadyListener(onReady);
        }

        if (this.selectedListener) {
            this.selectedListener.forEach(listener => {
                this.getTree().addSelectListener(listener);
            })
        }
        this.reload();
    }

    J

    private clearShow() {
        this.jsTree.destroy();
        this.$element.children().remove();
    }

    async initSubControls() {
        if (this.properties.refId >= 0) {

            this.refDto = await UiService.getReferenceDto(this.properties.refId) as any;

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
        let info: JsTreeInfo = {
            idField: Node.ID_FIELD, textField: Node.TEXT_FIELD,
            multiSelect: this.properties.isMulti
        };
        if (this.refDto) {
            if (this.refDto.parentField) {
                info.parentField = Node.PARENT_FIELD;
            } else if (this.refDto.codeField) {
                info.codeField = Node.CODE_FIELD;
            }
        } else {
            info.codeField = Node.CODE_FIELD;
        }
        return info;
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

    addSelectListener(listener: GeneralEventListener) {
        this.selectedListener.push(listener);
    }
}

export interface ReferenceTreeInfo {
    refId: number;
    version?: string;
    isMulti?: boolean;
}
