import {BaseDto} from "./BaseDto";

export class ColumnDto extends BaseDto {
    public schemaId: number;
    public tableId: number;
    public columnId: number;
    public fieldName: string;
    public nullable: number;
    public fieldIndex: number;
    public title: string;
    public defaultValue: string;
    public refId: number;
    public memo: string;
    public fieldType: string;
    public length: number;
    public precisionNum: number;
    public maxValue: number;
    public minValue: number;
    public isKey: number;
}
