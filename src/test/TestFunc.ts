import {MenuFunc} from "../decorator/decorator";
import {MenuFunction} from "../blockui/MenuFunction";
import {BorderLayout, BorderLayoutProperty} from "../blockui/layout/BorderLayout";
import {Component} from "../blockui/uiruntime/Component";
import {Form} from "../blockui/Form";
import {Constants} from "../common/Constants";
import "./testFunc.css";
import {MenuInfo} from "../sysfunc/menu/dto/MenuInfo";

@MenuFunc("TestFunc")
export default class TestFunc<T extends MenuInfo> extends MenuFunction<T> {
    private borderLayout: BorderLayout<BorderLayoutProperty>;

    protected createUI(): HTMLElement {
        let $ele = $("<div class='test-container' style='height: 100%'></div>");
        let layout = BorderLayoutProperty.genDefaultFullProperty();
        this.borderLayout = new BorderLayout<BorderLayoutProperty>(
            layout);
        $ele.append(this.borderLayout.getViewUI());
        return $ele.get(0);
    }

    protected initSubControls() {
        let lstComp = new Array<Component>();
        lstComp.push(Form.genSimpDto(
            Constants.ComponentType.text, "中方", 12, "name"));
        let form = new Form(null);
        form.setDisplayComponent(Form.genSimpleLocalViewer(lstComp));
        this.borderLayout.addComponent(BorderLayout.center, form);


        lstComp = new Array<Component>();
        lstComp.push(Form.genSimpDto(
            Constants.ComponentType.panel, "北方", 12, "name"));
        form = new Form(null);
        form.setDisplayComponent(Form.genSimpleLocalViewer(lstComp));
        this.borderLayout.addComponent(BorderLayout.north, form);


        lstComp = new Array<Component>();
        lstComp.push(Form.genSimpDto(
            Constants.ComponentType.panel, "西方", 12, "name"));
        form = new Form(null);
        form.setDisplayComponent(Form.genSimpleLocalViewer(lstComp));
        this.borderLayout.addComponent(BorderLayout.west, form);

        lstComp = new Array<Component>();
        lstComp.push(Form.genSimpDto(
            Constants.ComponentType.panel, "南方", 12, "name"));
        form = new Form(null);
        form.setDisplayComponent(Form.genSimpleLocalViewer(lstComp));
        this.borderLayout.addComponent(BorderLayout.south, form);

        lstComp = new Array<Component>();
        lstComp.push(Form.genSimpDto(
            Constants.ComponentType.panel, "东方", 12, "name"));
        form = new Form(null);
        form.setDisplayComponent(Form.genSimpleLocalViewer(lstComp));
        this.borderLayout.addComponent(BorderLayout.east, form);

        this.borderLayout.show();
        super.initSubControls();
    }

    afterComponentAssemble(): void {
        this.fireReadyEvent();
    }

}
