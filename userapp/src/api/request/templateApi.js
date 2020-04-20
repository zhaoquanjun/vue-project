import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 获取全部模板列表
export const getSiteTemplates = (para) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/v1/siteInfo/GetSiteTemplates`, para);
}
// 获取已有网站模板列表
export const getTemplateSites = (para) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/v1/siteInfo/GetTemplateSites`,para);
}
// 获取行业tree
export const getIndustryTree = () => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/v1/siteInfo/GetIndustryTree`);
}
// 选择全部模板
export const updateSiteTemplate = (para) => {
    return ajaxRequest.put(`${environment.siteManageApi}/api/v1/siteInfo/UpdateSiteTemplate`, para);
}
// 选择已有网站模板模板
export const updateSiteWithTemplate = (para) => {
    return ajaxRequest.put(`${environment.siteManageApi}/api/v1/siteInfo/UpdateSiteWithTemplate`, para);
}
// 应用模板
export const UseTemplateWithTheme = (para) => {
    return ajaxRequest.put(`${environment.siteManageApi}/api/v1/siteInfo/UseTemplateWithTheme`, para);
}
// 未找到想要的模板
export const createReferenceIndustry = (para) => {
    return ajaxRequest.post(`${environment.siteManageApi}/api/v1/siteInfo/CreateReferenceIndustry`, para);
}