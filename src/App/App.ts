import {MainFrame} from "../home/MainFrame";
import {IMainFrame} from "./IMainFrame";
import {FunctionReg} from "../FunctionReg";
import BaseUI from "../uidesign/view/BaseUI";
import {MenuFunction} from "../blockui/MenuFunction";

export class App {
    private mainFrame: IMainFrame;
    private lastFunc: MenuFunction<any>;
    private maskChange = false;

    start() {
        this.mainFrame = this.createMainFrame();
        let $body = $("body");
        $body.append(this.mainFrame.getViewUI());
        this.mainFrame.afterComponentAssemble();
        window.onhashchange = (e) => {
            if (this.maskChange) {
                this.maskChange = false;
                return;
            }
            if (this.lastFunc) {
                if (!this.lastFunc.beforeClose()) {
                    this.maskChange = true;
                    window.location = e.oldURL;
                    return;
                }
            }
            this.lastFunc = this.mainFrame.showFunc(FunctionReg.getFuncName(e.newURL.substr(e.newURL.lastIndexOf("#") + 1)));
        };

    }


    protected createMainFrame() {
        return new MainFrame({});
    }


}
