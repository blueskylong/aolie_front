import DmDesignBaseView from "./DmDesignBaseView";
import TableDto from "../../datamodel/dto/TableDto";

import {CommonUtils} from "../../common/CommonUtils";
import * as jsPlumb from "jsplumb";

export default class TapPanel extends DmDesignBaseView<TableDto> {
    private count = 0;

    protected createUI(): HTMLElement {
        return $(require("../template/TapPanel.html")).get(0);
    }

    public addTap(label: string, control: HTMLElement) {
        let $tap = $(" <li class=\"nav-item\">" +
            "            <a class=\"nav-link\" data-toggle=\"tab\" ></a>\n" +
            "        </li>");
        let id = CommonUtils.genUUID();
        $tap.find("a").text(label).attr("href", "#" + id);
        this.$element.find(".nav-tabs").append($tap);

        let $body = $("<div id=\"" + id + "\" class=\" tab-pane\">" +
            "        </div>");
        $body.append(control);
        this.$element.find(".tab-content").append($body);
        this.count++;
    }

    public setActiveTap(index: number) {
        if (index >= this.count) {
            return;
        }
        let taps = this.$element.find(".nav-link");
        taps.removeClass("active");
        $(taps.get(index)).addClass("active");

        let bodys = this.$element.find(".tab-pane");
        bodys.removeClass("active");
        $(bodys.get(index)).addClass("active");
    }


}
