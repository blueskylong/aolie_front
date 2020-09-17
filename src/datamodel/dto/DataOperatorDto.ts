import {BaseDto} from "./BaseDto";

export class DataOperatorDto  extends BaseDto{
    /**
     * 数据源名
     */
    public name: string;
    /**
     * ID
     */
    public id: number;
    /**
     * 是不是默认
     */
    public isDefault: number;
    /**
     * 连接串
     */
    public url: string;
    /**
     * 用户名
     */
    public userName: string;
    /**
     * 密码
     */
    public password: string;
    /**
     * 说明
     */
    public memo: string;
    /**
     * 是否只读
     */
    public isReadonly: number;
    /**
     * 由Spring 管理的数据源名称
     */
    public dsName: string;
    /**
     * 驱动类名
     */
    public driverClassName: string;

    /**
     * 直接指定操作类名
     */
    public operatorClass: string;

}
