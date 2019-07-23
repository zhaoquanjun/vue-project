import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取配置详情
 * @param {*} option 
 */
export const getMailAccountDetail = (options) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/MailServer/GetMailAccountDetail`);
}
// 创建邮件配置
export const createMailAccount = (options) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/MailServer/CreateMailAccount`, options);
}
// 编辑邮件配置
export const editMailAccount = (options) => {
    return ajaxRequest.put(`${enbironmemy.siteManageApi}/api/MailServer/EditMailAccount`, options);
}
