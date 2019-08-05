import enbironmemy from "../../environment/index" 
console.log(enbironmemy.dashboardApi)
import * as ajaxRequest from "../ajaxRequest";

/**
 * @name 获取左侧菜单列表信息
 * @method GET
 */
export const getSliderMenuList = () => {
    return ajaxRequest.get(`${enbironmemy.dashboardApi}/api/appinfo/GetAppMenusByUserId`)
}
export const getUserDashboard = () => {  
    let params = {
        appId: ''
    }
    return ajaxRequest.get(`${enbironmemy.dashboardApi}/api/userInfo/GetUserDashboard`, params);
}
export const updateAppIdToCookie = () => {
    return ajaxRequest.put(`${enbironmemy.dashboardApi}/api/userInfo/UpdateAppIdToCookie`);
}


export const updateUserLastAppIdAndCookie = (appId) => {
    return ajaxRequest.put('/api/userInfo/UpdateUserLastAppIdAndCookie', JSON.stringify(appId));
}
/**
 * 获取用户头像 
 */
export const getAppHeadInfo = () => {
    return ajaxRequest.get(`${enbironmemy.dashboardApi}/api/appInfo/GetAppHeadInfo`);
}