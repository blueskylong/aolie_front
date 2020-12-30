export class AutoFit {
    public static addAutoFitComponent(element: HTMLElement, adjustWidth = true, adjustHeight = false) {
        //找到父亲,增加容器变化事件,
        $(element).addClass("auto-fit").css("display", "inline-block");

    }

    public static doAdjust() {

    }

}

$(window).on("resize", (e) => {

})
