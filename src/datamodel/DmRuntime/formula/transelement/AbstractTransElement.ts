import {TransCenter, TransElement} from "./TransElement";
import {DmConstants} from "../../../DmConstants";
import {Schema} from "../../Schema";

export abstract class AbstractTransElement implements TransElement {
    protected elementInner = "";
    protected elementCN = "";

    getName(): string {
        return this.elementCN;
    }

    abstract getOrder(): number ;

    getElementType(): number {
        return DmConstants.FormulaElementType.compare;
    }

    isMatchCn(str): boolean {
        return str.indexOf(" " + this.elementCN + " ") !== -1
            && !str.trim().startsWith(this.elementCN)
            && !str.trim().endsWith(this.elementCN);
    }

    isMatchInner(str): boolean {

        //暂时不考虑引号内的问题
        return str.indexOf(this.elementInner) !== -1
            && !str.trim().startsWith(this.elementInner)
            && !str.trim().endsWith(this.elementInner);
    }

    transToCn(curElement: string, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        let eles = curElement.split(" " + this.elementInner + " ");

        if (eles.length != 2) {
            throw new Error(this.getName() + "条件不合法:需要二个元素进行比较");
        }
        return transcenter.transToCn(eles[0], transcenter) + " " + this.elementCN + " " +
            transcenter.transToCn(eles[1], transcenter);

    }

    transToInner(curElement: string, schema: Schema, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        let eles = curElement.split(" " + this.elementCN + " ");

        if (eles.length != 2) {
            throw new Error(this.getName() + "条件不合法:需要二个元素进行比较");
        }
        return transcenter.transToInner(eles[0], schema, transcenter) + " " + this.elementInner + " " +
            transcenter.transToInner(eles[1], schema, transcenter);
    }

    getExpressionCN() {
        return this.getName();
    }

    protected getValue(rowData) {
        return this.elementInner;
    }

    /**
     * 翻译成值表达式,
     * @param curElement
     * @param rowData
     * @param schema
     * @param transcenter
     */
    transToValue(curElement: string, rowData, schema?: Schema, transcenter?: TransCenter): string {
        let eles = curElement.split(" " + this.elementInner + " ");

        if (eles.length != 2) {
            throw new Error(this.getName() + "条件不合法:需要二个元素进行比较");
        }
        return transcenter.transToValue(eles[0], rowData, schema, transcenter) + " " + this.getValue(rowData) + " " +
            transcenter.transToValue(eles[1], rowData, schema, transcenter);
    }

    isOnlyForFilter(): boolean {
        return true;
    }

}
