// export * from "./dmdesign/DmDesign";
import Axios from "axios";

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'split-pane';
import "jquery-contextmenu/dist/jquery.contextMenu";
import "jquery-contextmenu/dist/jquery.contextMenu.css";
import "babel-polyfill";
import "font-awesome/css/font-awesome.min.css";
import "jquery-contextmenu/dist/jquery.ui.position.min";
import "bootstrap-select/dist/js/bootstrap-select.min.js";
import "bootstrap-select/dist/css/bootstrap-select.css";
import {NetRequest} from "./common/NetRequest";
import "./jsplugs/jquery.dragsort";

import "free-jqgrid";
import "free-jqgrid/dist/css/ui.jqgrid.min.css";
import './common.css';
import {App} from "./App/App";

import "./FunctionReg"

export * from "./uidesign/view/JQueryComponent"
export * from "./datamodel/DmRuntime/formula/transelement"

$.getJSON('./config.json', function (r) {
    NetRequest.axios = Axios.create({
        baseURL: r.baseURL,
        withCredentials: true
    });
});


$(() => {
    new App().start();


    // let dmDesign = new DmDesign();
    // dmDesign.start($("#container").get(0));
    // let dto = new BlockViewDto();
    // dto.blockViewId = 20;
    // dto.versionCode = "000000";
    // let form = new Form(dto);
    // $("#container").append(form.getViewUI());
    // form.afterComponentAssemble();
});



