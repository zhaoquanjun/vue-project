import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 查询普通控件
export const getNormalControls = (para) => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/NormalControl/GetNormalControls`, para);
}
// 开通普通控件
export const createNormalControl = (para) => {
    return ajaxRequest.post(`${environment.templateApi}/api/v1/NormalControl/CreateNormalControl`, para);
}
// 设置普通控件
export const saveNormalControl = (para) => {
    return ajaxRequest.put(`${environment.templateApi}/api/v1/NormalControl/SaveNormalControl`, para);
}
// 删除普通控件
export const deleteNormalControl = (id) => {
    return ajaxRequest._delete(`${environment.templateApi}/api/v1/NormalControl/DeleteNormalControl${id}`);
}