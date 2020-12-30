export class FormulaTools {
    static colReg = /\$\{(.+?)\}/;
    static colReg_g = /\$\{(.+?)\}/g;
    static paramReg = /\#\{(.+?)\}/;
    static paramReg_g = /\#\{(.+?)\}/g;

    /**
     * 取得列参数,形如${1}
     * @param str
     */
    static getColumnParams(str): Array<string> {
        let result = str.match(FormulaTools.colReg_g);
        let list = [];
        if (result) {
            for (let i = 0; i < result.length; i++) {
                let item = result[i];
                list.push(this.getParamInnerStr(item))
            }
        }
        return list
    }

    /**
     * 取得列ID,形如: 从${1} 中取出1
     * @param param
     */
    static getParamInnerStr(param: string) {
        return param.substr(2, param.length - 3);
    }

    static getSysParams(str): Array<string> {
        let result = str.match(FormulaTools.paramReg_g);
        let list = [];
        for (let i = 0; i < result.length; i++) {
            let item = result[i];
            list.push(item.match(FormulaTools.paramReg)[1])
        }
        return list;
    }


}
