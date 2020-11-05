import {PageInfoDto} from "./PageInfoDto";
import {PageDetailDto} from "./PageDetailDto";
import {PopulateBean} from "../../decorator/decorator";

export class PageInfo {
    /**
     * 主信息
     */

    private pageInfoDto: PageInfoDto;

    /**
     * 明细信息
     */
    private lstPageDetail: Array<PageDetailDto>;

    @PopulateBean(PageInfoDto)
    setPageInfoDto(pageInfoDto: PageInfoDto) {
        this.pageInfoDto = pageInfoDto;
    }

    @PopulateBean(PageDetailDto)
    setPageDetailDto(lstPageDetail: Array<PageDetailDto>) {
        this.lstPageDetail = lstPageDetail;
    }

    getPageInfoDto() {
        return this.pageInfoDto;
    }

    getPageDetail() {
        return this.lstPageDetail;
    }
}
