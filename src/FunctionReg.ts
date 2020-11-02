//注意,注意引入的方式
/**数据设计*/
import "./dmdesign/DmDesign";
/**界面设计*/
import "./uidesign/BlockDesign";
/**功能设计*/
import "./funcdesign/PageDesign";

import "./test/TestFunc";

export class FunctionReg {
    static menus = {"1": "DmDesign", "2": "BlockDesign", "3": "PageDesign", "99": "TestFunc"};

    static getFuncName(url: string) {
        return this.menus[url] as string;
    }
}

new FunctionReg();

