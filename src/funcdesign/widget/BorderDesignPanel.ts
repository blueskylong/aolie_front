import {BorderLayout, BorderLayoutProperty} from "../../blockui/layout/BorderLayout";
import {DesignBox} from "./DesignBox";
import {CommonUtils} from "../../common/CommonUtils";

export class BorderDesignPanel extends BorderLayout<BorderLayoutProperty> {
    private northComp: DesignBox;
    private centerComp: DesignBox;
    private westComp: DesignBox;
    private eastComp: DesignBox;
    private southComp: DesignBox;

    protected initSubControllers() {
        this.northComp = new DesignBox({color: {r: 3, g: 169, b: 244, a: 0.2}});
        this.centerComp = new DesignBox({color: {r: 0, g: 188, b: 212, a: 0.2}});
        this.westComp = new DesignBox({color: {r: 0, g: 150, b: 136, a: 0.2}});
        this.eastComp = new DesignBox({color: {r: 76, g: 175, b: 80, a: 0.2}});
        this.southComp = new DesignBox({color: {r: 139, g: 195, b: 74, a: 0.2}});

        this.addComponent(BorderLayout.north, this.northComp);
        this.addComponent(BorderLayout.center, this.centerComp);
        this.addComponent(BorderLayout.west, this.westComp);
        this.addComponent(BorderLayout.east, this.eastComp);
        this.addComponent(BorderLayout.south, this.southComp);
        super.initSubControllers();
    }
}
