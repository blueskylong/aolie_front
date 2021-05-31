/**
 * @author xxl
 * @date 2021-03-06 20:35:14
 * @version 1.0
 */
import {BaseDto} from "../../../datamodel/dto/BaseDto";


export class WfTable2flowDto extends BaseDto {

    private id: number;
    private tableId: number;
    private wfId: number;

    public setId(id) {
        this.id = id;
    }

    public getId() {
        return this.id;
    }

    public setTableId(tableId) {
        this.tableId = tableId;
    }

    public getTableId() {
        return this.tableId;
    }

    public setWfId(wfId) {
        this.wfId = wfId;
    }

    public getWfId() {
        return this.wfId;
    }

}
