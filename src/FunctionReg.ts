//注意,注意引入的方式
/**数据设计*/
import "./dmdesign/DmDesign";
/**界面设计*/
import "./uidesign/BlockDesign";
/**功能设计*/
import "./funcdesign/PageDesign";
/**
 * 通用设计功能
 */
import "./blockui/ManagedFunc";

import "./test/TestFunc";
import {MenuDto} from "./sysfunc/menu/dto/MenuDto";

export class FunctionReg {
    static menus = {"1": "DmDesign", "2": "BlockDesign", "3": "PageDesign", "4": "ReferenceFunc", "99": "TestFunc"};

    static getFuncName(url: string) {
        if (url == "5") {
            let menuDto = new MenuDto();
            menuDto.menuId = 5;
            menuDto.funcName = "ManagedFunc";
            menuDto.pageId = 4951156849084928;
            return menuDto;
        }
        return this.menus[url] as string;
    }
}

new FunctionReg();

