import environment from "@/environment/index";
import * as ajaxRequest from "../ajaxRequest";

// 创建aksk
export const set = (para) => {
    return ajaxRequest.post(`${environment.memberManageApi}/api/v1/AkSk/set`, para);
}
// 刷新aksk
export const update = (para) => {
    return ajaxRequest.post(`${environment.memberManageApi}/api/v1/AkSk/update`, para);
}
// 获取当前app的aksk
export const get = () => {
    return ajaxRequest.get(`${environment.memberManageApi}/api/v1/AkSk/get`);
}
// 删除当前aksk
export const remove = () => {
    return ajaxRequest._delete(`${environment.memberManageApi}/api/v1/AkSk/delete`);
}
// 删除签名和模板
export const removeTemplate = () => {
    return ajaxRequest._delete(`${environment.siteManageApi}/api/v1/SMS/DeleteAllSignAndTemplate`);
}