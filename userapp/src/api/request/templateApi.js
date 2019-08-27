import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 获取全部模版列表
export const getSiteTemplates = (para) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetSiteTemplates`, para);
}
// 获取已有网站模版列表
export const getTemplateSites = () => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetTemplateSites`);
}
// 获取行业tree
export const getIndustryTree = () => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetIndustryTree`);
}
// 选择模版
export const updateSiteTemplate = (para) => {
    return ajaxRequest.put(`${environment.siteManageApi}/api/siteInfo/UpdateSiteTemplate`, para);
}
// 未找到想要的模版
export const createReferenceIndustry = (para) => {
    return ajaxRequest.post(`${environment.siteManageApi}/api/siteInfo/CreateReferenceIndustry`, para);
}