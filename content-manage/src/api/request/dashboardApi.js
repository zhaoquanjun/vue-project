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
 * 切换app记录appId
 */
export const updateUserLastAppIdAndCookie = (appId) => {    
    return ajaxRequest.post(`${environment.dashboardApi}/api/userInfo/UpdateUserLastAppIdAndCookie/${appId}`);
}