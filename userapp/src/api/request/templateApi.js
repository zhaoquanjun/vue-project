import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 获取全部模版列表
export const getSiteTemplates = (para) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetSiteTemplates`, para);
}
// 获取已有网站模版列表
export const getTemplateSites = (para) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetTemplateSites`,para);
}
// 获取行业tree
export const getIndustryTree = () => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetIndustryTree`);
}
// 选择全部模版
export const updateSiteTemplate = (para) => {
    return ajaxRequest.put(`${environment.siteManageApi}/api/siteInfo/UpdateSiteTemplate`, para);
}
// 选择已有网站模版模版
export const updateSiteWithTemplate = (para) => {
    return ajaxRequest.put(`${environment.siteManageApi}/api/siteInfo/UpdateSiteWithTemplate`, para);
}
// 未找到想要的模版
export const createReferenceIndustry = (para) => {
    return ajaxRequest.post(`${environment.siteManageApi}/api/siteInfo/CreateReferenceIndustry`, para);
}