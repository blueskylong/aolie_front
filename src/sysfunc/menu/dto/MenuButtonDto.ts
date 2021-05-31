/**
 * 菜单按钮
 */
export class MenuButtonDto {
    menuId: number;
    btnId: number;
    params: string;
    rightCodes: string;
    lvlCode: string;
    title: string;
    states: string;
    funcName: string;
    relationTableid: number;
    tableOpertype: number;
    forOne: number;//不在每行显示,只显示一个
    memo: string;
    iconClass: string;
    //-----以下非DTO内容,仅前端使用
    isUsed = false;
}
