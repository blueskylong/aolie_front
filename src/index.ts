// export * from "./dmdesign/DmDesign";
import Axios from "axios";

import "./plugins"

import {NetRequest} from "./common/NetRequest";
import "./jsplugs/jquery.dragsort";


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



