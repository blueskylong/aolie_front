import {BorderLayout, BorderLayoutProperty} from "../../blockui/layout/BorderLayout";
import {DesignBox} from "./DesignBox";
import {CommonUtils} from "../../common/CommonUtils";
import EventBus from "../../dmdesign/view/EventBus";
import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";
import PageService from "../serivce/PageService";
import {BeanFactory} from "../../decorator/decorator";
import {PageInfo} from "../dto/PageInfo";
import {PageDetailDto} from "../dto/PageDetailDto";

export class BorderDesignPanel extends BorderLayout<BorderLayoutProperty> {
    //每一个块的容器
    private lstComp: Array<DesignBox> = new Array<DesignBox>();

    private listener: GeneralEventListener;
    private northComp: DesignBox;
    private centerComp: DesignBox;
    private westComp: DesignBox;
    private eastComp: DesignBox;
    private southComp: DesignBox;

    private activeComp: DesignBox;


    setListener(listener: GeneralEventListener) {
        this.listener = listener;
    }

    protected initSubControllers() {
        this.northComp = new DesignBox({color: {r: 3, g: 169, b: 244, a: 0.2}, name: BorderLayout.north});
        this.centerComp = new DesignBox({color: {r: 0, g: 188, b: 212, a: 0.2}, name: BorderLayout.center});
        this.westComp = new DesignBox({color: {r: 0, g: 150, b: 136, a: 0.2}, name: BorderLayout.west});
        this.eastComp = new DesignBox({color: {r: 76, g: 175, b: 80, a: 0.2}, name: BorderLayout.east});
        this.southComp = new DesignBox({color: {r: 139, g: 195, b: 74, a: 0.2}, name: BorderLayout.south});

        this.lstComp.push(this.northComp);
        this.lstComp.push(this.centerComp);
        this.lstComp.push(this.westComp);
        this.lstComp.push(this.eastComp);
        this.lstComp.push(this.southComp);

        for (let box of this.lstComp) {
            this.addComponent(box.getName(), box);
            box.setSelectChangeListener({
                handleEvent: (eventType: string, data: object, source: object, extObject?: any) => {
                    //如果是选择变化
                    if (eventType === EventBus.SELECT_CHANGE_EVENT) {
                        let box = <DesignBox>source;
                        this.activeComp = box;
                        for (let dbox of this.lstComp) {
                            dbox.setActive(box === dbox);
                        }
                        if (this.listener) {
                            this.listener.handleEvent(eventType, data, source, extObject);
                        }
                    }
                }

            });
        }
        this.show();
        super.initSubControllers();
    }

    /**
     * 取得控件的容器
     * @param position
     */
    private getCompByPosition(position) {
        for (let comp of this.lstComp) {
            if (comp.getName() === position) {
                return comp;
            }
        }
        return null;
    }

    getData() {
        let result = [];
        for (let comp of this.lstComp) {
            if (comp.getValue()) {
                result.push(comp.getValue());
            }
        }
        return result;
    }

    showPage(pageId) {
        this.clear();
        if (pageId) {
            PageService.findPageDetail(pageId, (data) => {
                let lstDto = BeanFactory.populateBeans(PageDetailDto, data);
                if (lstDto && lstDto.length > 0) {
                    for (let dto of lstDto) {
                        let comp = this.getCompByPosition(dto.pagePosition);
                        if (comp) {
                            comp.showComp(dto, null);
                        }
                    }
                }
            });
        }
    }

    attrChanged(property, value) {
        if (this.activeComp) {
            this.activeComp.attrChanged(property, value);
        }
    }

    clear() {
        for (let box of this.lstComp) {
            box.clear();
        }
    }


    destroy(): boolean {
        for (let box of this.lstComp) {
            box.destroy();
        }
        this.lstComp = null;
        return super.destroy();
    }
}
