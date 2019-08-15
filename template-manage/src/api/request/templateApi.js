import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 获取一级行业
export const getFirstIndustries = () => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetFirstIndustries`);
}
// 创建模版
export const createTemplate = () => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/CreateTemplate`);
}
// 获取模版列表
export const getSiteTemplates = (para) => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetSiteTemplates`, para);
}