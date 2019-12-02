import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 查询控件模板
export const getComposeTemplates = (para) => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/CombinedControl/GetComposeTemplates`, para);
}
// 开通控件模板
export const createComposeTemplate = (para) => {
    return ajaxRequest.post(`${environment.templateApi}/api/v1/CombinedControl/CreateComposeTemplate`, para);
}