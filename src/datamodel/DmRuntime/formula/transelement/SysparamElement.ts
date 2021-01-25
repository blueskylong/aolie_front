import {FormulaElement, TransCenter, TransElement} from "./TransElement";
import {DmConstants} from "../../../DmConstants";
import {Schema} from "../../Schema";
import {FormulaTools} from "../FormulaTools";
import {SchemaFactory} from "../../../SchemaFactory";
import {GlobalParams} from "../../../../common/GlobalParams";

@FormulaElement()
export class SysparamElement implements TransElement {

    getElementType(): number {
        return DmConstants.FormulaElementType.sysparam;
    }

    getName(): string {
        return "系统参数";
    }

    getExpressionCN(): string {
        return this.getName();
    }

    getOrder(): number {
        return this.getElementType();
    }

    isMatchCn(str): boolean {
        return FormulaTools.isSysParam(str);
    }

    isMatchInner(str): boolean {
        return FormulaTools.isSysParam(str);
    }

    transToCn(curElement: string, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        let sysParams = FormulaTools.getSysParams(curElement);
        if (sysParams && sysParams.length > 0) {
            for (let paramExp of sysParams) {
                let paramInfo = GlobalParams.getParamInfo(paramExp);
                curElement = FormulaTools.replaceParamNameStr(curElement, paramExp, paramInfo.name);
            }
        }
        return curElement;
    }

    transToInner(curElement: string, schema: Schema, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        let sysParams = FormulaTools.getSysParams(curElement);
        if (sysParams && sysParams.length > 0) {
            for (let paramName of sysParams) {
                let paramInfo = GlobalParams.getParamInfoByName(paramName);
                curElement = FormulaTools.replaceParamNameStr(curElement, paramName, paramInfo.id + "");
            }
        }
        return curElement;
    }


}
