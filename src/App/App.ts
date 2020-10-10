import {MainFrame} from "../home/MainFrame";
import {IMainFrame} from "./IMainFrame";
import {FunctionReg} from "../FunctionReg";
import {MenuFunction} from "../blockui/MenuFunction";
import {CommonUtils} from "../common/CommonUtils";

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

        /**
         * URL变化时触发的事件
         */
        $(() => {
            let hash = window.location.hash;
            if (!CommonUtils.isEmpty(hash) && "" !== hash) {
                this.lastFunc = this.mainFrame.showFunc(FunctionReg.getFuncName(hash.substr(1)));
            }
        });


    }


    protected createMainFrame() {
        return new MainFrame({});
    }


}
