import {PageViewerDto} from "../../uidesign/dto/PageViewerDto";
import {Layout} from "./Layout";
import {BlockViewer} from "./BlockViewer";

export  class PageViewer {
    /**
     * DTO
     */
    private _pageViewerDto:PageViewerDto;
    /**
     * 布局对象
     */
    private _layout:Layout;
    /**
     * 区块对象
     */
    private _lstBlockViewer:Array<BlockViewer>;


    get layout(): Layout {
        return this._layout;
    }

    set layout(value: Layout) {
        this._layout = value;
    }

    get pageViewerDto(): PageViewerDto {
        return this._pageViewerDto;
    }

    set pageViewerDto(value: PageViewerDto) {
        this._pageViewerDto = value;
    }

    get lstBlockViewer(): Array<BlockViewer> {
        return this._lstBlockViewer;
    }

    set lstBlockViewer(value: Array<BlockViewer>) {
        this._lstBlockViewer = value;
    }
}
