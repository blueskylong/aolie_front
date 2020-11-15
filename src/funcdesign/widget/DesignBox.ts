import BaseUI from "../../uidesign/view/BaseUI";
import {CommonUtils} from "../../common/CommonUtils";
import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {BeanFactory} from "../../decorator/decorator";
import {Constants} from "../../common/Constants";
import {Table} from "../../blockui/table/Table";
import {ServerRenderProvider} from "../../blockui/table/TableRenderProvider";
import {Form} from "../../blockui/Form";
import EventBus from "../../dmdesign/view/EventBus";
import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";
import {PageDetailDto} from "../dto/PageDetailDto";
import {UiService} from "../../blockui/service/UiService";
import {PageInfoDto} from "../dto/PageInfoDto";

export class DesignBox extends BaseUI<DesignBoxInfo> {
    private pageDetailDto: PageDetailDto;
    private baseUi: BaseUI<any>;
    private $masker: JQuery;
    private selectChangeListener: GeneralEventListener;

    private dropHandler: (event, data) => void;

    protected createUI(): HTMLElement {
        let $ele = $(require("../template/DesignBox.html"));
        this.$masker = $ele.find(".masker");
        this.$masker.css("background-color",
            "rgba(" + this.properties.color.r + "," + this.properties.color.g + ","
            + this.properties.color.b + "," + this.properties.color.a + ")");

        return $ele.get(0);
    }

    setSelectChangeListener(listener: GeneralEventListener) {
        this.selectChangeListener = listener;
    }

    afterComponentAssemble(): void {
        super.afterComponentAssemble();
        this.dropHandler = (event, data) => {

            //这个是放到面板上
            if (this.$element.find(data.event.target).length > 0
                || data.event.target === this.$element.find(".design-body").get(0)) {
                this.showComp(data.data.origin.get_node(data.data.nodes[0]).data.blockViewId);
                this.selectMe();
            }
        };
        $(document).on("dnd_stop.vakata.jstree", this.dropHandler);
        this.bindEvent();
    }

    private bindEvent() {
        let $closeBtn = this.$element.find(".close-button");
        this.$element.on("mouseenter", (e) => {
            if (this.pageDetailDto) {
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
        });
        this.$element.on("mousedown", (event) => {
            this.selectMe();

        });
    }

    private selectMe() {
        this.$element.trigger("focus");
        setTimeout(() => {
            this.selectChangeListener.handleEvent(EventBus.SELECT_CHANGE_EVENT, this.getValue(), this);
        }, 100);
    }

    getValue(pageId?) {
        if (this.pageDetailDto && pageId) {
            this.pageDetailDto.pageId = pageId;
        }
        return this.pageDetailDto;
    }

    attrChanged(property, value) {
        if (this.pageDetailDto) {
            this.pageDetailDto[property] = value;
        }
    }

    getName() {
        return this.properties.name;
    }

    setActive(isActive) {
        if (isActive) {
            this.$element.addClass("active");
        } else {
            this.$element.removeClass("active");
        }
    }

    protected createBlockDto(data) {
        return BeanFactory.populateBean(BlockViewDto, data);
    }

    async showComp(blockViewinfo: string | PageDetailDto) {
        this.clear();
        let viewer = null;
        let blockViewId = null;
        if (typeof blockViewinfo != "object") {
            blockViewId = blockViewinfo as any;
            this.pageDetailDto = this.createDefaultPageDetail(blockViewId);
        } else {
            blockViewId = blockViewinfo.viewId;
            this.pageDetailDto = blockViewinfo;
        }
        viewer = await UiService.getSchemaViewer(blockViewId);
        if (viewer.blockViewDto.defaultShowType == Constants.DispType.table) {
            this.baseUi = new Table(new ServerRenderProvider(blockViewId));
            this.$element.append(this.baseUi.getViewUI());
            (<Table>this.baseUi).showTable();
        } else {
            this.baseUi = Form.getInstance(viewer.blockViewDto.blockViewId);
            this.$element.append(this.baseUi.getViewUI());
            this.baseUi.afterComponentAssemble();
        }

    }

    private createDefaultPageDetail(blockViewId) {
        let dto = new PageDetailDto();
        dto.viewId = CommonUtils.genId();
        dto.initHeight = 1;
        dto.initWidth = 1;
        dto.pagePosition = this.getName();
        dto.viewId = blockViewId;
        return dto;
    }

    clear() {
        if (this.baseUi) {
            this.baseUi.destroy();
        }
        this.baseUi = null;
        this.pageDetailDto = null;
    }

    destroy(): boolean {
        this.clear();
        $(document).off("dnd_stop.vakata.jstree", this.dropHandler);
        return super.destroy();
    }


}

export class DesignBoxInfo {
    color: { r: number, g: number, b: number, a: number };
    name: string;
}
