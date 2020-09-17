import * as internal from "assert";
import {BaseDto} from "./BaseDto";

export class TableColumnRelationDto  extends BaseDto{
    public relationType: number;
    public fieldFrom: number;
    public fieldTo: number;
}
