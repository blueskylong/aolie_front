import {Table} from "../../blockui/table/Table";
import {CommonUtils} from "../../common/CommonUtils";
import {ManagedTable} from "../../blockui/managedView/ManagedTable";

export class TableDemo extends ManagedTable {
    getOptions(): FreeJqGrid.JqGridOptions {
        return {
            colNames: ['列1', '列2', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
            colModel: [
                {name: 'id22', index: 'id', width: 55, search: true},
                {
                    name: 'invdate',
                    index: 'invdate',
                    width: 90,
                    search: true,
                    searchoptions: {sopt: ['eq', 'ne', 'le', 'lt', 'gt', 'ge']}
                },
                {name: 'name', index: 'name', width: 100, search: false},
                {
                    name: 'amount',
                    index: 'amount',
                    width: 80,
                    searchoptions: {sopt: ['eq', 'ne', 'le', 'lt', 'gt', 'ge']}
                },
                {name: 'tax', index: 'tax', width: 80},
                {name: 'total', index: 'total', width: 80},
                {name: 'note', index: 'note', width: 150, sortable: false}
            ],
            rowNum: 10,
            rowList: [10, 20, 30],
            sortname: 'id22',
            viewrecords: true,
            sortorder: "desc",
            multiselect: true
        };

    }

    public doTest() {
        CommonUtils.readyDo(() => {
            return this.isReady();
        }, () => {

            this.$element.setGridHeight(200);
            // this.setMultiSelect(false);
            // this.showSearch(true);

            setTimeout(() => {
                this.$element.setGridHeight(500);
            }, 5000);
            setTimeout(() => {
                this.stopEdit();
            }, 10000);
            this.reloadData();
        })


    }

}
