import "bootstrap-fileinput-npm/js/fileinput"
import "bootstrap-fileinput-npm/css/fileinput.css"
import "bootstrap-fileinput-npm/js/fileinput_locale_zh"
import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";
import {BeanFactory, RegComponent} from "../../../decorator/decorator";
import {Constants} from "../../../common/Constants";
import {CommonUtils} from "../../../common/CommonUtils";
import {Alert} from "./Alert";
import {NetRequest} from "../../../common/NetRequest";
import {HandleResult} from "../../../common/HandleResult";
import {AffixDto} from "../../dto/AffixDto";

@RegComponent(Constants.ComponentType.file)
export class FileInput<T extends Component> extends TextInput<T> {

    public static EVENT_UPLOADED = "EVENT_UPLOADED";
    public static EVENT_AFTER_DELETE = "EVENT_AFTER_DELETE";
    public static EVENT_BEFORE_UPLOAD = "EVENT_BEFORE_UPLOAD";

    protected fileInput: JQuery;
    private rowId = -1;
    private static PREVIEW_TEMPLATE = "<object style='width:160px;height:160px'><div class=\"file-preview-other\">\n" +
        "   <span class=\"file-icon-4x\"><i class=\"fa fa-file\"></i></span>\n" +
        "</div></object>";

    protected getEditorType() {
        return "file";
    }

    getValue() {
        if (CommonUtils.isEmpty(this.rowId)) {
            this.rowId = -1;
        }
        return this.rowId;
    }

    public getFileInput() {
        return this.fileInput;
    }

    setValue(value) {
        this.rowId = value;
        if (CommonUtils.isEmpty(this.rowId)) {
            this.rowId = -1;
        }
        this.fileInput.data("fileinput").options.uploadUrl = this.getUpdateUrl();
        this.updateByServer();

    }

    private updateByServer() {
        if (!this.rowId || this.rowId < 0) {
            this.fileInput.fileinput("refresh", this.getDefaultOption());
            return;
        }
        CommonUtils.handleResponse(NetRequest.axios.get("/findAffixList/" + this.getColumnId() + "/" + this.rowId)
            , (result: HandleResult) => {
                if (result.data && result.data['length'] > 0) {
                    let dtos = BeanFactory.populateBeans(AffixDto, result.data as any);
                    let lstFile = [];
                    let preview = [];
                    for (let dto of dtos) {
                        lstFile.push({
                            key: dto.affixId,
                            caption: dto.oraFilename,
                            url: CommonUtils.getServerUrl("/deleteAffix/" + dto.affixId)
                        });
                        preview.push(FileInput.PREVIEW_TEMPLATE);
                    }
                    this.fileInput.fileinput("refresh", {
                        initialPreviewConfig: lstFile,
                        initialPreview: preview
                    });
                } else {
                    this.fileInput.fileinput("refresh", {});
                }
            });
    }

    protected createEditor(id: string) {
        //form-control
        return $("<div class='file-container com-editor '><input class='com-editor form-control'" +
            " name='" + this.properties.getColumn().getColumnDto().fieldName + "' id='" + id
            + "' type='" + this.getEditorType() + "' multiple/></div>");
    }

    afterComponentAssemble(): void {
        let attr = $.extend(true, {}, this.getDefaultOption(), {maxFileCount: 5});
        this.fileInput = this.getEditor().find("input")
            .fileinput(attr);
        this.fileInput.on('filepreupload', (event, data, previewId, index) => {     //上传中

            this.fireEvent(FileInput.EVENT_BEFORE_UPLOAD, data, this, previewId);
        }).on("fileuploaded", (event, data, previewId, index) => {    //一个文件上传成功

            this.rowId = data.response.rowId;
            this.fireValueChanged(this.getFieldName(), data.response.rowId);
            this.fireEvent(FileInput.EVENT_UPLOADED, data, this, previewId);

        }).on('fileerror', function (event, data, msg) {  //一个文件上传失败

        }).on("filesuccessremove", (event, data, previewId, index) => {
            this.fireEvent(FileInput.EVENT_AFTER_DELETE, data, this, previewId);
        }).on('filepredelete', function (event, key, jqXHR, data) {
            console.log(jqXHR);
            console.log(data);
        }).on("fileclear", () => {
        })
    }

    private getUpdateUrl() {
        return CommonUtils.getServerUrl("upload/" +
            this.properties.column.getColumnDto().columnId + "/" + this.getValue());
    }

    private getDataInfo(previewId?: string, index?: number) {
        let info = {columnId: this.properties.column.getColumnDto().columnId, rowId: this.rowId};
        return info;
    }


    public upload(rowId) {
        this.rowId = rowId;
        this.fileInput.fileinput("upload");
    }

    setEnable(enable: boolean) {
        this.enabled = enable;
        if (enable) {
            this.fileInput.fileinput("enable");
        } else {
            this.fileInput.fileinput("disable");
        }
    }

    setEditable(editable: boolean) {
        this.editable = editable;
        if (editable) {
            this.fileInput.fileinput("enable");
        } else {
            this.fileInput.fileinput("disable");
        }
    }

    destroy(): boolean {
        this.fileInput.fileinput("destroy");
        return super.destroy();
    }

    protected getDefaultOption(): BootstrapFileInput.FileInputOptions {
        return {
            language: 'zh',
            previewFileIcon: '<i class="fa fa-file"></i>',
            uploadUrl: CommonUtils.getServerUrl("/upload/" + this.getColumnId() + "/" + this.rowId),   //上传地址
            showPreview: true,              //展前预览
            removeFromPreviewOnError: true, //当选择的文件不符合规则时，例如不是指定后缀文件、大小超出配置等，选择的文件不会出现在预览框中，只会显示错误信息
            maxFileCount: 1,
            maxFileSize: 1024 * 10,           //单位为kb，如果为0表示不限制文件大小
            deleteUrl: CommonUtils.getServerUrl("/deleteAffix/" + this.rowId),
            fileActionSettings: {
                removeIcon: '<i class="fa fa-trash text-danger"></i>',
                uploadIcon: '<i class="fa fa-upload"></i>',
                downloadIcon: '<i class="fa fa-download"></i>'
            }
        }
    }
}

$.extend($.fn.fileinput['defaults'], {
    removeIcon: '<i class="fa fa-trash"></i>',
    browseIcon: '<i class="fa fa-folder-open-o"></i>',
    uploadIcon: '<i class="fa fa-upload"></i>'
});
