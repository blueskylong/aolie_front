/**
 * 显示配置页面
 */
import {BorderLayout, BorderLayoutProperty} from "./layout/BorderLayout";
import {BaseComponent} from "../uidesign/view/BaseComponent";
import {GlobalParams} from "../common/GlobalParams";
import {UiService} from "./service/UiService";
import {PageInfoDto} from "../funcdesign/dto/PageInfoDto";
import {PageInfo} from "../funcdesign/dto/PageInfo";
import {PageDetailDto} from "../funcdesign/dto/PageDetailDto";
import {Constants} from "../common/Constants";
import {Table} from "./table/Table";
import {ServerRenderProvider} from "./table/TableRenderProvider";
import {TreeUI} from "./JsTree/TreeUI";
import {Form} from "./Form";
import {ReferenceTree} from "./JsTree/ReferenceTree";
import {CommonUtils} from "../common/CommonUtils";
import BaseUI from "../uidesign/view/BaseUI";

export default class PageUI<T extends PageUIInfo> extends BaseComponent<any> {

    protected layout: BorderLayout<any>;
    protected pageInfo: PageInfo;
    protected lstBaseUI: Array<BaseUI<any>> = new Array<BaseUI<any>>();

    protected createUI(): HTMLElement {
        this.layout = new BorderLayout<any>(BorderLayoutProperty.genDefaultFullProperty());
        return $("<div class='full-display'></div>").get(0);
    }

    static getInstance(pageId, version?) {
        let blockDto = new PageInfoDto();
        blockDto.pageId = pageId;
        blockDto.versionCode = version || GlobalParams.getLoginVersion();
        let pageUI = new PageUI(blockDto);
        return pageUI;
    }


    async initSubControllers() {
        if (!this.pageInfo) {
            this.pageInfo = await UiService.findPageInfo(this.properties.pageId) as any;
        }
        if (!this.pageInfo || !this.pageInfo.getPageDetail()) {
            return;
        }
        this.addComponents();
        this.$element.append(this.layout.getViewUI());
    }

    private async addComponents() {
        let lstPageDetail = this.pageInfo.getPageDetail();
        if (!lstPageDetail || lstPageDetail.length == 0) {
            return;
        }
        for (let detail of lstPageDetail) {
            let baseUI = await this.createSubUI(detail);
            this.lstBaseUI.push(baseUI);
            this.layout.addComponent(detail.pagePosition, baseUI);
        }
        this.ready = true;
    }

    protected async createSubUI(pageDetail: PageDetailDto) {
        let baseUi = null;
        if (pageDetail.viewType == Constants.PageViewType.blockView) {
            //以下显示块
            let blockViewId = pageDetail.viewId;
            //如果是表
            let viewer = await UiService.getSchemaViewer(blockViewId);
            let showType = viewer.blockViewDto.defaultShowType;
            if (pageDetail.showType) {
                showType = pageDetail.showType;
            }

            if (showType == Constants.DispType.table) {
                baseUi = new Table(new ServerRenderProvider(blockViewId));
            } else if (showType == Constants.DispType.tree) {
                let treeInstance = TreeUI.getTreeInstance(viewer.blockViewDto.blockViewId);
                baseUi = treeInstance;
            } else {
                baseUi = Form.getInstance(viewer.blockViewDto.blockViewId);
            }
        } else if (pageDetail.viewType == Constants.PageViewType.reference) {//引用只可以用树
            baseUi = ReferenceTree.getTreeInstance(pageDetail.viewId, pageDetail.versionCode);
        } else {//嵌套其它页面
            baseUi = PageUI.getInstance(pageDetail.viewId, pageDetail.versionCode);

        }
        return baseUi;
    }

    afterComponentAssemble(): void {
        //这个只能等到所有子界面存在后,才可以调用
        CommonUtils.readyDo(() => {
            if (!this.pageInfo || this.pageInfo.getPageDetail().length != this.lstBaseUI.length) {
                return false;
            }
            return true;
        }, () => {
            this.layout.afterComponentAssemble();

        });
        //这个只能等到所有子界面存完成后,才可以调用
        CommonUtils.readyDo(() => {
            if (!this.pageInfo.getPageDetail() || this.pageInfo.getPageDetail().length == 0) {
                return true;
            }
            for (let baseUI of this.lstBaseUI) {
                if (!baseUI.isReady()) {
                    return false;
                }
            }
            return true;
        }, () => {
            this.fireReadyEvent();
        });

    }

    getValue(): any {
    }

    setEditable(editable: boolean) {
    }

    setEnable(enable: boolean) {
    }

    setValue(value: any) {
    }

    destroy(): boolean {
        this.layout.destroy();
        this.pageInfo = null;
        return super.destroy();
    }


}

export interface PageUIInfo {
    pageId: number;
    version?: string;
}
