import {BaseDto} from "./BaseDto";

export default class SchemaDto  extends BaseDto{
    public schemaId: number;
    public schemaName: string;
    public memo: string;
}
