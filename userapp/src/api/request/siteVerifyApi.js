import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取标签详情
 * @param {*} option 
 */
export const getSiteValidationTags = (options) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/SiteValidation/GetSiteValidationTags/${options}`);
}
// 创建标签配置
export const createSiteValidationTags = (options) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/SiteValidation/CreateSiteValidationTags`, options);
}
// 编辑标签配置
export const editSiteValidationTags = (options) => {
    return ajaxRequest.put(`${enbironmemy.siteManageApi}/api/SiteValidation/EditSiteValidationTags`, options);
}