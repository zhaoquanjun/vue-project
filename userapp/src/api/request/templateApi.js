import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 获取模版列表
export const getSiteTemplates = (para) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetSiteTemplates`, para);
}
// 获取行业tree
export const getIndustryTree = () => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetIndustryTree`);
}
// 选择模版
export const updateSiteTemplate = (para) => {
    return ajaxRequest.put(`${environment.siteManageApi}/api/siteInfo/UpdateSiteTemplate`, para);
}