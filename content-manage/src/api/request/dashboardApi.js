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
/**
 * 获取site列表
 */
export const getSites = () => {
  return ajaxRequest.get(`${environment.designerManageApi}/api/v1/siteInfo/GetSites`);
}
// 切换自动翻译状态
export const switchAutoTranslateStatus = () => {
  return ajaxRequest.put(`${environment.designerManageApi}/api/v1/Page/SwitchAutoTranslateStatus`);
};
// 获取自动翻译状态
export const getAutoTranslateConfig = () => {
  return ajaxRequest.get(`${environment.designerManageApi}/api/v1/Page/GetAutoTranslateConfig`);
};
