export class ComponentConstants {
    /**
     * 控件类型对应生成器
     */
    public static COMPONENT_GENERATOR = {
        text: "JQueryGeneralComponentGenerator",
        button: "JQueryGeneralComponentGenerator",
        password: "JQueryGeneralComponentGenerator",
        hidden: "JQueryGeneralComponentGenerator",
        file: "JQueryGeneralComponentGenerator",
        checkbox: "JQueryGeneralComponentGenerator",
        radio: "JQueryGeneralComponentGenerator",
        textarea: "JQueryGeneralComponentGenerator",
        select: "JQueryGeneralComponentGenerator",
        label: "JQueryGeneralComponentGenerator",
        panel: "JQueryGeneralComponentGenerator"
    };

    public static setComponentGenerator(compId: string, handlerName: string) {
        this.COMPONENT_GENERATOR[compId] = handlerName;
    }
}
