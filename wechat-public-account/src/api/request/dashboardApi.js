import environment from "@/environment/index";

import * as ajaxRequest from "../ajaxRequest";

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
    console.log("5555",environment.dashboardApi)
    return ajaxRequest.get(`${environment.dashboardApi}/api/userInfo/GetCurrentSiteId`);
};
/**
 * 更改siteName
 */
export const updateSiteName = (siteId, siteName) => {
    let para = { siteId: siteId, siteName: siteName }
    console.log(siteId, para);
    return ajaxRequest.put(`${environment.pageApi}/api/siteInfo/UpdateSiteName`, para);
};
/**
* 更改站点语言
*/
export const updateSiteLanguage = (siteId, language) => {
    let para = { siteId: siteId, language: language }
    return ajaxRequest.put(`${environment.pageApi}/api/siteInfo/UpdateSiteLanguage`, para);
};
/**
 * 获取site列表
 */
export const getSites = () => {
    return ajaxRequest.get(`${environment.pageApi}/api/siteInfo/GetSites`);
}
/**
 * 获取app信息
 */
export const getApplication = () => {
    return ajaxRequest.get(`${environment.pageApi}/api/appInfo/GetApplication`);
}

/**
 * 获取设计秘籍列表，版本更新列表，应用推荐列表
 */
export const getAppExpandInfo = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/appInfo/GetAppExpandInfo`);
}

/**
 * 获取app列表
 */
export const getApplicationsByUserId = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/appInfo/GetApplicationsByUserId`);
}
/**
 * 切换app记录appId
 */
export const updateUserLastAppIdAndCookie = (appId) => {    
    return ajaxRequest.post(`${environment.dashboardApi}/api/userInfo/UpdateUserLastAppIdAndCookie/${appId}`);
}
/**
 * 切换site记录siteId
 */
export const updateUserLastSiteId = (siteId) => {
    return ajaxRequest.put(`${environment.dashboardApi}/api/userInfo/UpdateUserLastSiteId`, siteId);
}



