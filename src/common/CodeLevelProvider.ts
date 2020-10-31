/**
 * Created by Administrator on 2017/4/26.
 */
import {CommonUtils} from "./CommonUtils";


export class CodeLevelProvider {

    public static DEFAULT_CODE_RULE = '3|3|3|3|3|3';
    private rules: number[];
    private curCode: string;

    constructor(rule?: string) {
        if (CommonUtils.isEmpty(rule)) {
            rule = CodeLevelProvider.DEFAULT_CODE_RULE;
        }
        let sRule = rule.split('|');
        let sum = 0;
        this.rules = new Array<number>();
        for (let i = 0; i < sRule.length; i++) {
            sum += parseInt(sRule[i], 10);
            this.rules[i] = sum;
        }
    }

    public resetCurCode() {
        this.curCode = null;
    }

    /**
     * 取得默认的级次提供器
     * @returns {CodeLvlProvider}
     */
    public static getDefaultCodePro() {
        return new CodeLevelProvider(CodeLevelProvider.DEFAULT_CODE_RULE);
    }

    public setCurCode(curCode) {
        if (CommonUtils.isEmpty(curCode)) {
            curCode = this.getNext();
        }
        if (this.rules.indexOf(curCode.length) == -1) {
            throw new Error('当前编码不符合长度要求，当前长度为：' + curCode.length + '  可能的长度为：' + this.rules);
        }
        this.curCode = curCode;


    }

    // 取得取级下一个节点
    public getNext() {
        if (CommonUtils.isEmpty(this.curCode)) {
            this.curCode = this.createLvlStr(this.rules[0], 1);
        } else {
            let curLvlNum = this.getCurLvlNum();

            let curLvlLength = this.rules[curLvlNum] - (curLvlNum == 0 ? 0 : this.rules[curLvlNum - 1]);
            this.curCode = this.getPreLvlString() + this.createLvlStr(curLvlLength, this.getEndLvlStringToNum() + 1);
        }
        return this.curCode;
    }

    /**取得下一个节节点*/
    public getSubNext() {
        if (CommonUtils.isEmpty(this.curCode)) {
            this.curCode = this.createLvlStr(this.rules[0], 1);
        } else {
            let curLvlNum = this.getCurLvlNum();
            let curLvlLength = this.rules[curLvlNum + 1] - this.rules[curLvlNum];
            this.curCode = this.curCode + this.createLvlStr(curLvlLength, 1);
        }
        return this.curCode;
    }
    /**取得下一个子节点,从000开始*/
    public goSub(){
            if (CommonUtils.isEmpty(this.curCode)) {
                this.curCode = this.createLvlStr(this.rules[0], 0);
            } else {
                let curLvlNum = this.getCurLvlNum();
                let curLvlLength = this.rules[curLvlNum + 1] - this.rules[curLvlNum];
                this.curCode = this.curCode + this.createLvlStr(curLvlLength, 0);
            }
    }

    // 取得上一级的全编码
    public getPreLvlString() {
        let curLvlNum = this.getCurLvlNum();
        if (curLvlNum == 0) {
            return '';
        }
        return this.curCode.substr(0, this.rules[curLvlNum - 1]);
    }

    // 取得最后一个级次当前的数字
    private getEndLvlStringToNum() {
        if (CommonUtils.isEmpty(this.curCode)) {
            return 0;
        }
        let curlvlNum = this.getCurLvlNum();
        let start = 0;
        if (curlvlNum != 0) {
            start = this.rules[curlvlNum - 1];
        }

        return parseInt(this.curCode.substr(start,
            this.curCode.length), 10);
    }

    public getCurLvlNum() {
        if (CommonUtils.isEmpty(this.curCode)) {
            return 0;
        } else {
            return this.rules.indexOf(this.curCode.length);
        }
    }

    private createLvlStr(len: number, num: number) {
        let str = ('0000000' + num);
        return str.substr(str.length - len, str.length);
    }
}
