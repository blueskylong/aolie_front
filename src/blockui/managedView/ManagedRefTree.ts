import {AutoManagedUI, ManagedEventListener} from "./AutoManagedUI";
import {ReferenceTree, ReferenceTreeInfo} from "../JsTree/ReferenceTree";
import {Constants} from "../../common/Constants";
import {GlobalParams} from "../../common/GlobalParams";
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";

/**
 * 引用树,只会触发自己的选择事件.
 */
export class ManagedRefTree<T extends ReferenceTreeInfo> extends ReferenceTree<T> implements AutoManagedUI {
    private listener: ManagedEventListener;
    protected pageDetail: PageDetailDto;

    attrChanged(source: any, tableId, mapKeyAndValue, field, value) {
        return;
    }

    dataRemoved(source: any, tableId, mapKeyAndValue) {
        return;
    }

    dsSelectChanged(source: any, tableId, mapKeyAndValue, row?) {
        return;
    }


    getTableIds(): Array<number> {
        return [];
    }

    loadData() {
        this.reload();
    }

    getPageDetail(): PageDetailDto {
        return this.pageDetail;
    }

    referenceSelectChanged(source: any, refId, id) {
        return;
    }

    setManageEventListener(listener: ManagedEventListener) {
        this.listener = listener;
    }

    stateChange(tableId, state: number) {
    }

    static getManagedInstance(reference, pageDetail: PageDetailDto, version?) {
        let refInfo = {refId: reference, version: version || GlobalParams.getLoginVersion()};
        let tree = new ManagedRefTree(refInfo);
        tree.pageDetail = pageDetail;
        return tree;
    }


    afterComponentAssemble(): void {
        super.afterComponentAssemble();
        this.getTree().addSelectListener({
            handleEvent: (eventType: string, data: any, source: any, extObject?: any) => {
                if (this.listener) {
                    let data = this.getTree().getCurrentData();
                    let id = null;
                    if (data) {
                        id = data.id;
                    }
                    this.listener.referenceSelectChanged(this, this.properties.refId, id);
                }
            }
        });

        if (this.pageDetail && this.pageDetail.loadOnshow == 1) {
            this.reload();
        }

    }


}
