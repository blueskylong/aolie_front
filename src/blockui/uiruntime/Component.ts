import {ComponentDto} from "../../uidesign/dto/ComponentDto";
import {Column} from "../../datamodel/DmRuntime/Column";
import {BeanFactory, PopulateBean} from "../../decorator/decorator";
import {ColumnDto} from "../../datamodel/dto/ColumnDto";
import {Constants} from "../../common/Constants";

/**
 * 视图中的控件处理类
 */
export class Component {

    componentDto: ComponentDto;
    /**
     * 对应的列设置
     */
    column: Column;

    isConvertToCamel = false;

    //这是一个虚拟值,是由社图主信息提供
    private layoutType = Constants.PositionLayoutType.bootstrapLayout;


    constructor() {
    }

    public setLayoutType(layoutType){
        this.layoutType =layoutType;
    }

    public getLayoutType(){
        return this.layoutType;
    }

    getComponentDto(): ComponentDto {
        return this.componentDto;
    }

    @PopulateBean(ComponentDto)
    setComponentDto(value: ComponentDto) {
        this.componentDto = value;
    }

    getColumn(): Column {
        return this.column;
    }

    @PopulateBean(Column)
    setColumn(value: Column) {
        this.column = value;
    }

    getTextAlign() {
        if (this.isNumberField()) {
            return "right";
        }
        return "left";
    }

    /**
     * 是不是数字控件
     */
    public isNumberField() {
        return this.componentDto.dispType === Constants.ComponentType.number;
    }

    /**
     * 是不是数字列
     */
    public isNumberColumn(): boolean {
        return this.column.isNumberColumn();
    }

    /**
     * 组装一个组件对象
     * @param comp
     */
    static fromSimpleComponent(comp: SimpleComponent) {
        let component = new Component();
        let comDto = BeanFactory.populateBean(ComponentDto, comp);
        let columnDto = BeanFactory.populateBean(ColumnDto, comp);
        component.componentDto = comDto;
        component.column = new Column();
        component.column.setColumnDto(columnDto);
        return component;
    }
}

export interface SimpleComponent {
    lvlCode?: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 显示方式,如text,datetime等
     */
    dispType: string;
    /**
     * 横向占比例,类似于bootstrap的12列,占多少列的意思
     */
    horSpan: number;

    verSpan?: number;
    /**
     * 如果为列表显示,则显示的宽度,0表示列表中不显示
     */
    width?: number;
    /**
     * 可编辑条件,空表示可编辑
     */
    editableFilter?: string;
    /**
     * 可见条件,空表示可见
     */
    visibleFilter?: string;
    /**
     * 显示格式,如数字,日期等
     */
    format?: string;
    /**
     * 自定义标题的颜色
     */
    titleColor?: string;
    /**
     * 说明
     */
    memo?: string;
    /**
     * 自定义css样式类
     */
    cssClass?: string;
    /**
     * 扩展样式
     */
    extStyle?: string;
    /**
     * 分组类型
     */
    groupType?: number;
    /**
     * 默认排序类型
     */
    orderType?: number;
    /**
     * 背景色
     */
    backgroundColor?: string;
    /**
     * 标题位置
     */
    titlePosition?: string;
    titleSpan?: number;
    fieldName: string;
    nullable?: number;
    defaultValue?: string;
    refId?: number;
    length?: number;
    precision?: number;
    maxValue?: number;
    minValue?: number;
}
