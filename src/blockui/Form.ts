import {BaseComponent} from "../uidesign/view/BaseComponent";
import {TreeNode, TreeNodeFactory} from "../common/TreeNode";
import {IComponentGenerator} from "../uidesign/view/generator/IComponentGenerator";
import {BlockViewDto} from "../uidesign/dto/BlockViewDto";
import {JQueryGeneralComponentGenerator} from "../uidesign/view/JQueryComponent/JQueryGeneralComponentGenerator";
import {UiService} from "./service/UiService";
import {Component} from "./uiruntime/Component";
import EventBus from "../dmdesign/view/EventBus";
import {CommonUtils} from "../common/CommonUtils";
import {StringMap} from "../common/StringMap";
import {BlockViewer} from "./uiruntime/BlockViewer";
import {GlobalParams} from "../common/GlobalParams";
import {ComponentDto} from "../uidesign/dto/ComponentDto";
import {Constants} from "../common/Constants";
import {ColumnDto} from "../datamodel/dto/ColumnDto";
import {Column} from "../datamodel/DmRuntime/Column";
import {BeanFactory} from "../decorator/decorator";


export class Form extends BaseComponent<BlockViewDto> {
    /**
     * 字段名对应控件
     */
    private subComponents: StringMap<BaseComponent<Component>> = new StringMap<BaseComponent<Component>>();
    private lstComponent: Array<Component>;
    private values: StringMap<object>;

    private _blockViewId: number;
    private _version: string;
    private generator: IComponentGenerator = new JQueryGeneralComponentGenerator();

    private editable = true;
    private enabled = true;
    private isShowTitle = false;
    private isShowClose = false;
    private lstCloseListener: Array<(form: Form) => void>;

    private $formBody: JQuery;

    private viewer: BlockViewer;
    //是否本地使用
    private isLocal = false;


    constructor(dto: BlockViewDto) {
        super(dto);
        if (dto) {
            this.blockViewId = dto.blockViewId;
            this.version = dto.versionCode;
        } else {
            this.isLocal = true;
            let blockDto = new BlockViewDto();
            blockDto.colSpan = 12;
            this.properties = blockDto;
            this.viewer = new BlockViewer();
        }
    }

    static getInstance(blockId, version?) {
        let blockDto = new BlockViewDto();
        blockDto.blockViewId = blockId;
        blockDto.versionCode = version || GlobalParams.getLoginVersion();
        return new Form(blockDto);
    }

    showHead(isShow) {
        this.isShowTitle = isShow;

    }

    showClose(isShowClose) {
        this.isShowClose = isShowClose && this.editable;

    }

    updateTitle() {
        if (this.isShowTitle) {
            this.$element.find(".form-head").removeClass(Form.HIDDEN_CLASS);
        } else {
            this.$element.find(".form-head").addClass(Form.HIDDEN_CLASS);
        }
        if (this.isShowClose) {
            this.$element.find(".btn-close").removeClass(Form.HIDDEN_CLASS);
        } else {
            this.$element.find(".btn-close").addClass(Form.HIDDEN_CLASS);
        }
    }


    setBlockViewer(viewer) {
        this.viewer = viewer;
    }

    get blockViewId(): number {
        return this._blockViewId;
    }

    set blockViewId(value: number) {
        this._blockViewId = value;
    }

    get version(): string {
        return this._version;
    }

    set version(value: string) {
        this._version = value;
    }

    async initSubControllers() {
        if (this.isLocal && !this.viewer) {
            return;
        }
        if (!this.viewer) {
            this.viewer = await UiService.getSchemaViewer(this.blockViewId) as any;
        }
        this.lstComponent = this.viewer.lstComponent;
        if (!this.lstComponent || this.lstComponent.length == 0) {
            this.lstComponent = [];
            return;
        }
        this.properties = this.viewer.blockViewDto;
        let comNodes = TreeNodeFactory.genTreeNode(this.lstComponent, "componentDto", "lvlCode");
        for (let node of comNodes) {
            if (this.properties.fieldToCamel == 1) {
                node.data.column.getColumnDto().fieldName
                    = CommonUtils.toCamel(node.data.column.getColumnDto().fieldName);
            }
            this.createSubComponents(this.$formBody.get(0), node);
        }
    }

    setDisplayComponent(viewer: BlockViewer) {
        if (!this.isLocal) {
            throw new Error("在线配置Form,不可以使用此方法");
        }
        this.getViewUI();
        this.viewer = viewer;
        this.initSubControllers();
    }

    protected createUI(): HTMLElement {
        let $ele = $(require("./templete/Form.html"));
        $ele.attr("blockId", this.blockViewId);
        if (this.properties.colSpan) {
            if (this.properties.colSpan <= 12) {
                //使用bootstrap布局
                $ele.addClass("col-md-" + this.properties.colSpan);
            } else {
                $ele.width(this.properties.colSpan);
            }
            if (this.properties.rowSpan) {
                $ele.height(this.properties.rowSpan);
            }
        }
        $ele.find(".form-title").text(this.properties.title);
        if (this.properties.showHead) {
            $ele.find(".form-head").removeClass(Form.HIDDEN_CLASS);
        }
        $ele.find(".close-button").on("click", (event) => {
            if (this.lstCloseListener) {
                for (let listener of this.lstCloseListener) {
                    listener(this);
                }
            }
        });
        this.$formBody = $ele.find(".form-body");
        return $ele.get(0);
    }

    /**
     * 创建子组件
     */
    private createSubComponents(parent: HTMLElement, node: TreeNode<Component>) {
        let component = this.generator.generateComponent(node.data.componentDto.dispType, node.data, parent, this);
        $(parent).append(component.getViewUI());
        component.afterComponentAssemble();
        this.subComponents.set(node.data.column.getColumnDto().fieldName, component);
        if (node.children && node.children.length > 0) {
            for (let subNode of node.children) {
                this.createSubComponents(component.getViewUI(), subNode);
            }
        }
    }


    getColumnId(): number {
        return 0;
    }

    getValue(): StringMap<object> {
        if (!this.values) {
            this.values = new StringMap<object>();
        }
        return this.values;
    }

    getValueForObject<T>(clazz: { new(...args: Array<any>): T }): T {
        return BeanFactory.populateBean(clazz, this.getValue().getValueAsObject());
    }


    setEditable(editable: boolean) {
        this.editable = editable;
        if (this.subComponents) {
            this.subComponents.forEach((value, key, map) => {
                value.setEditable(editable);
            });
        }
    }

    public isEditable() {
        return this.editable;
    }

    setEnable(enable: boolean) {
        this.enabled = enable;
        if (this.subComponents) {
            this.subComponents.forEach((value, key, map) => {
                value.setEnable(enable);
            });
        }
    }

    public isEnabled() {
        return this.enabled;
    }

    setValue(value: any) {
        //先去掉焦点
        this.stopEdit();
        this.values = new StringMap<object>(value);
        this.updateSubComponentValues();
    }

    public stopEdit() {
        if (this.editable) {
            this.$element.find(".com-editor").blur();
        }
    }

    protected updateSubComponentValues() {
        let objValue;
        this.subComponents.forEach((value, key, map) => {
            objValue = this.values.get(key);
            if (CommonUtils.isEmpty(objValue)) {
                this.subComponents.get(key).setValue(null);
            } else {
                this.subComponents.get(key).setValue(objValue);
            }
        });

    }

    addCloseListener(listener: (form: Form) => void) {
        if (!this.lstCloseListener) {
            this.lstCloseListener = new Array();
        }
        this.lstCloseListener.push(listener);
    }

    handleEvent(eventType: string, fieldName: object, value: object) {
        super.handleEvent(eventType, fieldName, value);
        if (eventType === EventBus.VALUE_CHANGE_EVENT) {
            if (!this.values) {
                this.values = new StringMap<object>();
            }
            this.values.set(fieldName + "", value);
            this.fireValueChanged(fieldName as any, value);
        }
        this.calcFormula(fieldName as any);
    }

    private calcFormula(fieldWhoChange: string) {
        //TODO 这里会有公式计算,界面使用计算,可以计算等
    }

    destroy(): boolean {
        //先移除子控件
        if (this.subComponents) {
            this.subComponents.forEach((value, key, map) => {
                value.destroy();
            });
        }
        this.subComponents = null;
        this.lstComponent = null;
        this.values = null;
        this.generator = null;

        return super.destroy();
    }

    addClass(className: string) {
        this.$element.addClass(className);
    }

    static genSimpleLocalViewer(lstComp: Array<Component>) {
        if (!lstComp || lstComp.length < 1) {
            return null;
        }
        let viewer = new BlockViewer();
        let viewerDto = new BlockViewDto();
        viewerDto.colSpan = 12;
        viewerDto.defaultShowType = Constants.DispType.form;
        viewer.setBlockViewDto(viewerDto);
        viewer.setLstComponent(lstComp);
        return viewer;
    }

    static genSimpDto(type, title, horSpan, field) {
        let dto = new ComponentDto();
        dto.dispType = type;
        dto.title = title;
        dto.horSpan = horSpan;
        dto.columnId = CommonUtils.nextInt();
        dto.componentId = CommonUtils.nextInt();
        let colDto = new ColumnDto();
        colDto.fieldName = field;
        colDto.columnId = dto.columnId;
        let column = new Column();
        column.setColumnDto(colDto);
        let comp = new Component();
        comp.setColumn(column);
        comp.setComponentDto(dto);
        return comp;
    }
}
