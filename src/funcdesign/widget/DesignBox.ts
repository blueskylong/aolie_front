import BaseUI from "../../uidesign/view/BaseUI";
import {CommonUtils} from "../../common/CommonUtils";
import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {BeanFactory} from "../../decorator/decorator";
import {Constants} from "../../common/Constants";
import {Table} from "../../blockui/table/Table";
import {ServerRenderProvider} from "../../blockui/table/TableRenderProvider";
import {Form} from "../../blockui/Form";
import EventBus from "../../dmdesign/view/EventBus";

export class DesignBox extends BaseUI<DesignBoxInfo> {
    private innerUiDto: BlockViewDto;
    private baseUi: BaseUI<any>;
    private $masker: JQuery;

    protected createUI(): HTMLElement {
        let $ele = $(require("../template/DesignBox.html"));
        this.$masker = $ele.find(".masker");
        this.$masker.css("background-color",
            "rgba(" + this.properties.color.r + "," + this.properties.color.g + ","
            + this.properties.color.b + "," + this.properties.color.a + ")");

        return $ele.get(0);
    }

    afterComponentAssemble(): void {
        super.afterComponentAssemble();
        $(document).on("dnd_stop.vakata.jstree", (event, data) => {

            //这个是放到面板上
            if (this.$element.find(data.event.target).length > 0
                || data.event.target === this.$element.find(".design-body").get(0)) {
                this.showComp(this.createBlockDto(data.data.origin.get_node(data.data.nodes[0]).data));
            }
        });
        this.bindEvent();
    }

    private bindEvent() {
        let $closeBtn = this.$element.find(".close-button");
        this.$element.on("mouseenter", (e) => {
            if (this.innerUiDto) {
                $closeBtn.removeClass(Form.HIDDEN_CLASS);
            }
        });
        this.$element.on("mouseleave", (e) => {
            $closeBtn.addClass(Form.HIDDEN_CLASS);
        });
        $closeBtn.on("click", (e) => {
            this.clear();
        });
        this.$element.on("scroll", (event) => {
            this.$masker.css("top", this.$element.scrollTop);

            this.$masker.css("left", this.$element.scrollLeft());
        })
    }

    protected createBlockDto(data) {
        return BeanFactory.populateBean(BlockViewDto, data);
    }

    protected showComp(innerUiDto: BlockViewDto) {
        this.clear();
        this.innerUiDto = innerUiDto;
        if (this.innerUiDto.defaultShowType == Constants.DispType.table) {
            this.baseUi = new Table(new ServerRenderProvider(this.innerUiDto.blockViewId));
            this.$element.append(this.baseUi.getViewUI());
            (<Table>this.baseUi).showTable();

        } else {
            this.baseUi = Form.getInstance(this.innerUiDto.blockViewId);
            this.$element.append(this.baseUi.getViewUI());
            this.baseUi.afterComponentAssemble();
        }
    }

    private clear() {
        if (this.baseUi) {
            this.baseUi.destroy();
        }
        this.baseUi = null;
        this.innerUiDto = null;
    }


}

export class DesignBoxInfo {
    color: { r: number, g: number, b: number, a: number };
}
