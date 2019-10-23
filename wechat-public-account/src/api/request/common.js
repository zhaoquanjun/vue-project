import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";
/**
 * 获取app列表
 */
export const getApplicationsByUserId = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/v1/appInfo/GetApplicationsByUserId`);
}
/**
 * 获取用户头像 
 */
export const getAppHeadInfo = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/v1/appInfo/GetAppHeadInfo`);
}
/**
 * 更改appName
 */
export const UpdateAppName = (appName) => {
    return ajaxRequest.put(`${environment.dashboardApi}/api/v1/appInfo/UpdateAppName`, JSON.stringify(appName));
};
/**
 * 获取当前siteId
 */
export const getCurSiteId = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/v1/userInfo/GetCurrentSiteId`);
};
/**
 * @name 获取左侧菜单列表信息
 * @method GET
 */
export const getSliderMenuList = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/v1/appinfo/GetAppMenusByUserId`)
}
/**
 * 获取appId
 */
export const updateAppIdToCookie = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/v1/userInfo/GetAppIdAndUpdateToCookie`);
}
/**
 * 切换app更新appId 
 */
export const updateUserLastAppIdAndCookie = (appId) => {    
    return ajaxRequest.post(`${environment.dashboardApi}/api/v1/userInfo/UpdateUserLastAppIdAndCookie/${appId}`);
}