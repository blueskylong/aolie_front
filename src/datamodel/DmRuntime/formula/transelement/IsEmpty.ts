import {AbstractTransElement} from "./AbstractTransElement";
import {DmConstants} from "../../../DmConstants";
import {FormulaElement, TransCenter} from "./TransElement";
import {Schema} from "../../Schema";

@FormulaElement()
export class IsEmpty extends AbstractTransElement {

    protected elementInner = "==null";
    protected elementCN = "为空";

    getOrder(): number {
        return this.getElementType() + 70;
    }

    isMatchCn(str): boolean {
        return str.indexOf(" " + this.elementCN) !== -1
            && !str.startsWith(this.elementCN)
            && str.trim().endsWith(this.elementCN);
    }

    isMatchInner(str): boolean {
        return str.indexOf(" " + this.elementInner) !== -1
            && !str.startsWith(this.elementInner)
            && str.trim().endsWith(this.elementInner);
    }

    transToCn(curElement: string, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        let eles = curElement.trim().split(" " + this.elementCN + " ");

        if (eles.length != 1) {
            throw new Error("条件不合法:需要一个元素进行比较");
        }
        return transcenter.transToCn(eles[0], transcenter) + " " + this.elementCN + " ";
    }

    transToInner(curElement: string, schema: Schema, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        let eles = curElement.trim().split(" " + this.elementCN + " ");

        if (eles.length != 1) {
            throw new Error("条件不合法:需要一个元素进行比较");
        }
        return transcenter.transToInner(eles[0], schema, transcenter)
            + " " + this.elementInner + " ";

    }

    getElementType(): number {
        return DmConstants.FormulaElementType.compare;
    }


}
