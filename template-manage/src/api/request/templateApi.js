import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 获取一级行业
export const getFirstIndustries = () => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetFirstIndustries`);
}
// 获取二级行业
export const getSecondIndustries = (firstIndustryId) => {
    let para = { firstIndustryId: firstIndustryId };
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetSecondIndustries`, para);
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
// 保存模版
export const saveSiteTemplate = (para) => {
    return ajaxRequest.put(`${environment.templateApi}/api/v1/Template/SaveSiteTemplate`, para);
}
// 获取模板详细信息
export const getSiteTemplate = (templateId) => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/Template/GetSiteTemplate`, {templateId:templateId});
}
// 更新模版
export const uploadSiteTemplate = (templateId) => {
    return ajaxRequest.put(`${environment.templateApi}/api/v1/Template/UploadSiteTemplate`, templateId);
}
// 删除模版
export const deleteTemplate = (id) => {
    return ajaxRequest._delete(`${environment.templateApi}/api/v1/Template/DeleteTemplate/${id}`);
}