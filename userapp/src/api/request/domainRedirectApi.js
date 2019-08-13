import { designerManageApi } from "@/environment/index"
import * as ajaxRequest from "../ajaxRequest";
import store from "@/store/index";
import Cookies from "js-cookie"
const siteId = Cookies("ymSd") ? Cookies("ymSd") : store.state.dashboard.siteId;

export const get301List = () => {
    return ajaxRequest.get(`${designerManageApi}/api/v1/DomainRedirection/Get301List/${siteId}`);
}
export const getActiveAndNotInUseDomainList = () => {
    return ajaxRequest.get(`${designerManageApi}/api/v1/DomainRedirection/GetActiveAndNotInUseDomainList/${siteId}`);
}
export const addDomainRedirection = (option) => {
    console.log(option,'option')
    let params = {
        siteId:siteId,
        ...option
    }
    return ajaxRequest.post(`${designerManageApi}/api/v1/DomainRedirection/AddDomainRedirection/`,params);
}
export const modifyDomainRedirection = (option,id) => {
    let params = {
        siteId:siteId,
        ...option
    }
    return ajaxRequest.put(`${designerManageApi}/api/v1/DomainRedirection/ModifyDomainRedirection/${id}`,params);
}

export const deleteDomainRedirection = (id) => {
    return ajaxRequest._delete(`${designerManageApi}/api/v1/DomainRedirection/DeleteDomainRedirection/${id}/${siteId}`);
}