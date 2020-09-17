import {BaseDto} from "./BaseDto";

export class ConstraintDto  extends BaseDto{
    /**
     * 表达式
     */
    public expression: string;
    /**
     * 过滤条件
     */
    public filter: string;
    /**
     * 条件顺序,只作显示用
     */
    public orderNum: number;
    /**
     * 约束的说明
     */
    public memo: string;
    /**
     * 是不是表内的约束
     */
    public isInner: number;
    /**
     * 禁用
     */
    public disabled: number;
}
