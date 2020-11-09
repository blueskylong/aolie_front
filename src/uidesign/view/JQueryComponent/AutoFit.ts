export class AutoFit {
    public static addAutoFitComponent(element: HTMLElement, adjustWidth = true, adjustHeight = false) {
        //找到父亲,增加容器变化事件,
        $(element).parent().on("resize", (e) => {
            if (adjustHeight) {
                $(element).height(() => {
                    return 100;
                });
            }
            if (adjustWidth) {
                $(element).width(() => {
                    return 100;
                });
            }
        })
    }
}
