import environment from "@/environment/index";
import * as ajaxRequest from "../ajaxRequest";

/**
 * 是否已上传
 */
export const hasUploadFile = (siteId) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/v1/Robots/HasUploadFile/${siteId}`);
}
/**
 * 预览
 */
export const preview = (siteId) => {
    return ajaxRequest.get(`${environment.siteManageApi}/api/v1/Robots/Preview/${siteId}`);
}
/**
 * 删除
 */
export const remove = (siteId) => {
    return ajaxRequest._delete(`${environment.siteManageApi}/api/v1/Robots/Remove/${siteId}`);
}