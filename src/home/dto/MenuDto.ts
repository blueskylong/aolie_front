/**
 * 菜单信息
 */
import {BaseDto} from "../../datamodel/dto/BaseDto";

export class MenuDto extends BaseDto {
    menuId: number;
    menuName: string;
    icon: string;
    lvlCode: string;
    pageId: number;
    params: string;
    enabled: number;
    defalutState: number;
    funcName;
}
