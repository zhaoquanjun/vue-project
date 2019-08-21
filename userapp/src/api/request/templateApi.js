import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// // 获取一级行业
// export const getFirstIndustries = () => {
//     return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetFirstIndustries`);
// }
// // 获取二级行业
// export const getSecondIndustries = (firstIndustryId) => {
//     let para = { firstIndustryId: firstIndustryId };
//     return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetSecondIndustries`, para);
// }

// 获取模版列表
export const getSiteTemplates = (para) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetSiteTemplates`, para);
}
// 获取模版列表
export const getFirstIndustries = () => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/GetFirstIndustries`);
}
// 选择模版
export const updateSiteTemplate = (para) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/siteInfo/UpdateSiteTemplate`, para);
}