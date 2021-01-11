import BaseUI from "../../uidesign/view/BaseUI";
import "./template/BorderLayout.css";

export class BorderLayout<T extends BorderLayoutProperty> extends BaseUI<T> {
    static center = "center";
    static north = "north";
    static east = "east";
    static west = "west";
    static south = "south";
    private southUi: BaseUI<any> = null;
    private northUi: BaseUI<any> = null;
    private eastUi: BaseUI<any> = null;
    private centerUi: BaseUI<any> = null;
    private westUi: BaseUI<any> = null;


    protected createUI(): HTMLElement {
        return $("<div class='border-layout-panel' style='height: 100%;width: 100%'></div>").get(0);
    }

    addComponent(position, baseUi: BaseUI<any>) {
        let uiProperty = position + "Ui";
        if (this.hasOwnProperty(uiProperty)) {
            this[uiProperty] = baseUi;
        }
    }

    /**
     * 正式组装视图
     */
    show() {
        if (!this.centerUi) {
            throw new Error("没有指定主容器中的控件");
        }
        let container = this.$element;
        if (this.northUi) {
            let comp = this.createHorizontalSplit("north-panel",
                "not-north-panel", container,
                this.properties.centerHeight + this.properties.southHeight,
                this.properties.northHeight);
            container.append(comp);
            comp.find(".north-panel").append(this.northUi.getViewUI());
            container = comp.find(".not-north-panel");
        }
        if (this.southUi) {
            let comp = this.createHorizontalSplit("middle-panel",
                "south-panel", container,
                this.properties.southHeight, this.properties.centerHeight);
            container.append(comp);
            comp.find(".south-panel").append(this.southUi.getViewUI());
            container = comp.find(".middle-panel");
        }
        if (this.westUi) {
            let comp = this.createVerticalSplit("west-panel",
                "center-east-panel", container, this.properties.westWidth,
                this.properties.centerWidth + this.properties.eastWidth);
            container.append(comp);
            comp.find(".west-panel").append(this.westUi.getViewUI());
            container = comp.find(".center-east-panel");
        }
        if (this.eastUi) {
            let comp = this.createVerticalSplit("center-panel",
                "east-panel", container, this.properties.centerWidth, this.properties.eastWidth);
            container.append(comp);
            comp.find(".east-panel").append(this.eastUi.getViewUI());
            container = comp.find(".center-panel");
        }
        container.append(this.centerUi.getViewUI());

        this.$element.find(".split-pane")['splitPane']();
    }

    afterComponentAssemble(): void {
        this.ready = true;
        this.fireReadyEvent();
    }


    private createHorizontalSplit(topClass, bottomClass, parent: JQuery, bottomHeight?, topHeight?) {
        if (!bottomHeight && !topHeight) {
            throw new Error("未指定分隔面板的分隔高度");
        }
        let com = $(require("./template/Horizontal.html"));
        let topPanel = com.find(".top-panel");
        let bottomPanel = com.find(".bottom-panel");
        let splitBar = com.find(".split-pane-divider");
        topPanel.addClass(topClass);
        bottomPanel.addClass(bottomClass);
        let height = bottomHeight;
        if (!bottomHeight) {
            if (topHeight > 1) {
                height = parent.height() - topHeight + "";

            } else {
                height = (1 - topHeight) * 100 + "%";
            }
        } else {
            if (bottomHeight < 1) {
                height = bottomHeight * 100 + "%";
            }
        }
        topPanel.css("bottom", height);
        splitBar.css("bottom", height);
        bottomPanel.height(height);
        return com;
    }

    destroy(): boolean {
        if (this.eastUi && !this.eastUi.isDestroied()) {
            this.eastUi.destroy();
        }
        if (this.northUi && !this.northUi.isDestroied()) {
            this.northUi.destroy();
        }
        if (this.southUi && !this.southUi.isDestroied()) {
            this.southUi.destroy();
        }
        if (this.westUi && !this.westUi.isDestroied()) {
            this.westUi.destroy();
        }
        if (this.centerUi && !this.centerUi.isDestroied()) {
            this.centerUi.destroy();
        }
        return super.destroy();
    }

    private createVerticalSplit(leftClass, rightClass, parent: JQuery, leftWidth?, rightWidth?) {
        if (!leftWidth && !rightWidth) {
            throw new Error("未指定分隔面板二边的宽度");
        }
        let com = $(require("./template/Vertical.html"));
        let leftPanel = com.find(".left-panel");
        let rightPanel = com.find(".right-panel");
        let splitBar = com.find(".split-pane-divider");
        leftPanel.addClass(leftClass);
        rightPanel.addClass(rightClass);
        let width = rightWidth;
        if (!width) {
            if (leftWidth > 1) {
                width = parent.width() - leftWidth + "";

            } else {
                width = (1 - leftWidth) * 100 + "%";
            }
        } else {
            if (width < 1) {
                width = width * 100 + "%";
            }
        }
        leftPanel.css("right", width);
        splitBar.css("right", width);
        rightPanel.width(width);
        return com;
    }

}

export class BorderLayoutProperty {
    canDrag = true;
    width = 1;
    height = 1;
    northHeight: number = 0;
    centerHeight: number = 0;
    middleHeight = 0;
    centerWidth: number = 0;
    westWidth?: number = 0;
    eastWidth?: number = 0;
    southHeight = 0;

    static genDefaultFullProperty() {
        let layout = new BorderLayoutProperty();
        layout.centerWidth = 0.4;
        layout.centerHeight = 0.6;
        layout.northHeight = 0.3;
        layout.westWidth = 0.3;
        layout.eastWidth = 0.3;
        layout.southHeight = 0.2;
        return layout;
    }
}
