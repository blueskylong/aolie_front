import {Page} from "./Page";
import {PopulateBean} from "../decorator/decorator";

export class HandleResult {
    /**
     * 是否成功
     */
    success = false;
    /**
     * 返回的数据
     */
    lstData: Array<object>;
    /**
     * 错误提供信息
     */
    err: string;

    /**
     * 数据变化记录数
     */
    changeNum = 0;
    /**
     * 分页信息
     */
    page: Page;

    @PopulateBean(Page)
    public setPage(page: Page) {
        this.page = page;
    }

    public getSuccess() {
        return this.success;
    }


}
