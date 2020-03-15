import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

/**
 * 获取app列表
 */
export const getApplicationsByUserId = appName => {
  return ajaxRequest.get(
    `${environment.dashboardApi}/api/v1/appInfo/GetApplicationsByUserId`,
    { appName: appName }
  );
};
/**
 * 获取用户头像
 */
export const getAppHeadInfo = () => {
  return ajaxRequest.get(
    `${environment.dashboardApi}/api/v1/appInfo/GetAppHeadInfo`
  );
};
/**
 * 更改appName
 */
export const updateAppName = para => {
  return ajaxRequest.put(
    `${environment.dashboardApi}/api/v1/appInfo/UpdateAppName`,
    para
  );
};
/**
 * 切换app记录appId
 */
export const updateUserLastAppIdAndCookie = appId => {
  return ajaxRequest.post(
    `${environment.dashboardApi}/api/v1/userInfo/UpdateUserLastAppIdAndCookie/${appId}`
  );
};
/**
 * 获取当前siteId
 */
export const getCurSiteId = () => {
  return ajaxRequest.get(
    `${environment.dashboardApi}/api/v1/userInfo/GetCurrentSiteId`
  );
};
