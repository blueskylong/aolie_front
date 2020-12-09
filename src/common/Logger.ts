/**
 * 目标辅助类,可以实现写到文件或后台
 */
export class Logger {
    static error(message, className?) {
        console.log("error:" + message + (className ? ("  类:" + className) : ""));
    }

    static info(message, className?) {
        console.log("info:" + message + (className ? ("  类:" + className) : ""));
    }

    static warning(message, className?) {
        console.log("warning:" + message + (className ? ("  类:" + className) : ""));
    }
}
