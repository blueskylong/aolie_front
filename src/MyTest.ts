import * as jsPlumb from "jsplumb";
import {Connection, EndpointRectangle} from "jsplumb";
import "./common.css"

export default class MyTest {

    public printline() {
        //共同的属性
        let common = {

            endpoint: "Rectangle",
            connector: 'Flowchart',
            anchor: "BottomLeft"
        }


        let ins = jsPlumb.jsPlumb.getInstance({});
        ins.ready(() => {
            // ins.connect({
            //     source: 'div1',
            //     target: 'div2',
            //     overlays: [["Label", {
            //         label: "这是1对多的关系",
            //
            //         "labelStyle": {
            //             color: "red",
            //             fill: "",
            //             borderStyle: "",
            //             borderWidth: 4,
            //             padding: 4,
            //         }
            //     }]]
            // }, common);
        });

        let endCommon = {
            isSource: true,
            isTarget: true,
            maxConnections: 3,
            connector: 'Straight',
            // endpoint: 'Dot',
            paintStyle: {
                fill: 'white',
                outlineStroke: 'blue',
                strokeWidth: 3
            },
            // hoverPaintStyle: {
            //     outlineStroke: 'lightblue'
            // },
            connectorStyle: {
                outlineStroke: 'green',
                strokeWidth: 1
            },
            connectorHoverStyle: {
                strokeWidth: 2
            }
        }

        ins.setContainer("container");
        $(".spot").each((index: number, elem: Element) => {
            ins.addEndpoint(elem, {
                    paintStyle: {fill: 'lightgray', stroke: 'darkgray', strokeWidth: 2},
                    anchor: "Top",
                    maxConnections: 1,
                    uuid: index + ""

                }, endCommon
            );
            $(elem).css("left", (150 * index) + "px");
            ins.addEndpoint(elem, {
                    paintStyle: {fill: 'lightgray', stroke: 'darkgray', strokeWidth: 2},
                    maxConnections: 3,
                }, endCommon
            );
            ins.draggable(elem, {containment: 'parent'});
        });

        setTimeout(() => {
            ins.connect({uuids: ["1", "2"]});
        }, 3000);
        ins.bind("connection", ((info, originalEvent) => {
            // alert(info);
        }));
        ins.bind('dblclick', function (info, originalEvent) {

            ins.deleteConnection(<any>info);

        });
        ins.bind('beforeDrop', (info, originalEvent: Event) => {

            let hasConnection = (ins.getConnections(<any>{
                source: info.sourceId,
                target: info.targetId
            }, null) as any).length > 0 || (ins.getConnections(<any>{
                source: info.targetId,
                target: info.sourceId
            }, null) as any).length > 0;
            if (hasConnection) {
                alert("已存在");
            }
            return !hasConnection;
        });


        ins.bind("contextmenu", (info, event) => {
            alert("menu")
            event.preventDefault();
        });

        ins.makeSource('A', {
            endpoint: "Dot",
            anchor: "Perimeter"
        });

        ins.makeTarget('B', {
            endpoint: "Dot",
            anchor: "Continuous"
        });

        ins.draggable('A');
        ins.draggable('B');
        console.log("xxxx");


    }

    public print(obj: string) {
        console.log(obj);
    }

}
new MyTest().printline();
new MyTest().print($.now().toString());

let zoom = (scale) => {
    $("#container").css({
        "-webkit-transform": `scale(${scale})`,
        "-moz-transform": `scale(${scale})`,
        "-ms-transform": `scale(${scale})`,
        "-o-transform": `scale(${scale})`,
        "transform": `scale(${scale})`
    })


}
// //缩放1
// var baseZoom = 1
// ins.setZoom(0.75);
// setInterval(() => {
//     baseZoom -= 0.1
//     if (baseZoom < 0.5) {
//         baseZoom = 1
//     }
//     zoom(baseZoom)
// }, 1000)


