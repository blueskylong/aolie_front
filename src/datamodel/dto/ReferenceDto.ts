import {BaseDto} from "./BaseDto";

export class ReferenceDto extends BaseDto {
    public refId: number;
    public tableName: string;
    public idField: string;
    public nameField: string;
    public onlyLeaf: number;
    public parentField: string;
    public codeField: string;
    public refName: string;
    /**
     * 如果是统一表中的引用,则要提供类型
     */
    public commonType: string;
}
