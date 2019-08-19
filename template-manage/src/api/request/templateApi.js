import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 获取一级行业
export const getFirstIndustries = () => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetFirstIndustries`);
}
// 创建模版
export const createTemplate = (designerPhone, remark) => {
    let para = {
        designerPhone: designerPhone,
        remark: remark
    }
    return ajaxRequest.post(`${environment.templateApi}/api/v1/Template/CreateTemplate`, para);
}
// 获取模版列表
export const getSiteTemplates = (para) => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetSiteTemplates`, para);
}
// 获取二级行业
export const getSecondIndustries = (firstIndustryId) => {
    let para = { firstIndustryId: firstIndustryId };
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetSecondIndustries`, para);
}