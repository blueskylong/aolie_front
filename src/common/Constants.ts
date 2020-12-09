import {CommonUtils} from "./CommonUtils";

export class Constants {

    static DEFAULT_SCHEMA_ID = 2;//默认的方案ID
    static DEFAULT_REFERENCE_ID = 0;//默认的引用方案
    static TitlePosition = {left: "left", right: "right", none: "none"};

    static ROW_HEIGHT = 25;

    static FieldType = {
        int: "int",
        varchar: "varchar",
        decimal: "decimal",
        datatime: "datatime"
    };

    static DispType = {
        form: 1,
        table: 2,
        tree: 3,
        card: 4,
        refTree: 5
    };

    static ComponentType = {
        text: "text",
        button: "button",
        password: "password",
        hidden: 'hidden',
        file: "fileinput",
        checkbox: "checkbox",
        radio: 'radioinput',
        textarea: "textarea",
        select: "select",
        label: "label",
        panel: "panel",
        time: "time",
        email: "email",
        color: "color",
        date: "date",
        number: "number",
        filter: "filter",
        formula: "formula"
    };

    static Icons = {
        add: "fa fa-plus-circle",
        delete: "fa fa-trash",
        save: "fa fa-floppy-o",
        edit: "fa fa-pencil",
        export: "fa fa-file-excel-o",
        word: "fa fa-file-word-o"
    };

    static TreeRole = {
        idField: 1,
        codeField: 2,
        nameField: 3,
        parentField: 4
    };

    /**
     * 页面明细的类型
     */
    static PageViewType = {
        blockView: 1,//界面
        reference: 2,//引用
        page: 3//页面
    };

    /**
     * 界面状态
     */
    static UIState = {
        edit: 1,
        view: 2,
        add: 3
    };
    /**
     * 通用的事件类型
     */
    static GeneralEventType = {
        //选择变化
        SELECT_CHANGE_EVENT: "SELECT_CHANGED",
        /**
         * 值变化事件
         */
        VALUE_CHANGE_EVENT: "VALUE_CHANGED"
    }


}

