import {BaseDto} from "./BaseDto";

export default class FormulaDto  extends BaseDto{
    public formulaId: number;
    /**
     * 对应表列的ID,一个列可以有多个公式
     */
    public columnId: number;

    public formula: string;
    public filter: string;
    public orderNum: number;

    public memo: string;
}
