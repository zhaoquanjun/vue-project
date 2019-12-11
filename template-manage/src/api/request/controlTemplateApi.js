import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 查询控件模板
export const getComposeTemplates = (para) => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/CombinedControl/GetComposeTemplates`, para);
}
// 修改控件模板名称
export const updateTemplateName = (para) => {
    return ajaxRequest.put(`${environment.templateApi}/api/v1/Template/UpdateTemplateName`, para);
}
// 开通控件模板
export const createComposeTemplate = (para) => {
    return ajaxRequest.post(`${environment.templateApi}/api/v1/CombinedControl/CreateComposeTemplate`, para);
}
// 查询控件管理
export const getCombinedControls = (para) => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/CombinedControl/GetCombinedControls`, para);
}
// 更新组合控件
export const updateCombinedControl = (para) => {
    return ajaxRequest.post(`${environment.templateApi}/api/v1/CombinedControl/UpdateCombinedControl`, para);
}
// 设置组合控件
export const saveCombinedControl = (para) => {
    return ajaxRequest.post(`${environment.templateApi}/api/v1/CombinedControl/SaveCombinedControl`, para);
}
// 删除组合控件
export const deleteCombinedControl = (para) => {
    return ajaxRequest._delete(`${environment.templateApi}/api/v1/CombinedControl/DeleteCombinedControl`, { data: para });
}