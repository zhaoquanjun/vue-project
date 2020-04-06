import environment from "@/environment/index";

import * as ajaxRequest from "../ajaxRequest";

/**
 * @name 获取邮箱配置
 */
export const getEmailConfig = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/mailserver/get`
  );
};

/**
 *
 * @name 创建邮箱配置
 * @param {} options Object
 */
export const createEmailConfig = options => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/mailserver/create`,
    options
  );
};

/**
 * @name 编辑邮箱配置
 * @param {*} options Object
 */
export const editEmailConfig = options => {
  return ajaxRequest.put(
    `${environment.memberManageApi}/api/v1/mailserver/edit`,
    options
  );
};

/**
 * @name 删除邮箱配置
 */
export const deleteEmailConfig = () => {
  return ajaxRequest._delete(
    `${environment.memberManageApi}/api/v1/mailserver/delete`
  );
};

/**
 * @name 获取发送记录
 */
export const getEmailSendInfo = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/mailserver/sendlist`
  );
};
