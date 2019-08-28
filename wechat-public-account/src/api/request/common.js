import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";
/**
 * 获取app列表
 */
export const getApplicationsByUserId = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/appInfo/GetApplicationsByUserId`);
}
/**
 * 获取用户头像 
 */
export const getAppHeadInfo = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/appInfo/GetAppHeadInfo`);
}
/**
 * 更改appName
 */
export const UpdateAppName = (appName) => {
    return ajaxRequest.put(`${environment.dashboardApi}/api/appInfo/UpdateAppName`, JSON.stringify(appName));
};
/**
 * 获取当前siteId
 */
export const getCurSiteId = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/userInfo/GetCurrentSiteId`);
};
/**
 * @name 获取左侧菜单列表信息
 * @method GET
 */
export const getSliderMenuList = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/appinfo/GetAppMenusByUserId`)
}
/**
 * 获取appId
 */
export const updateAppIdToCookie = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/userInfo/GetAppIdAndUpdateToCookie`);
}
/**
 * 切换app更新appId 
 */
export const updateUserLastAppIdAndCookie = (appId) => {    
    return ajaxRequest.post(`${environment.dashboardApi}/api/userInfo/UpdateUserLastAppIdAndCookie/${appId}`);
}