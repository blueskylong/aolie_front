import "./dmdesign/DmDesign";//数据设计
import "./uidesign/BlockDesign";
import DmDesign from "./dmdesign/DmDesign";
import {BlockDesign} from "./uidesign/BlockDesign";

export class FunctionReg {
    static menus = {"1": "DmDesign", "2": "BlockDesign"};

    static getFuncName(url: string) {
        return this.menus[url] as string;
    }
}

new FunctionReg();

