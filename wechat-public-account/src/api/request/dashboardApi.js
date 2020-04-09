import environment from "@/environment/index";

import * as ajaxRequest from "../ajaxRequest";

/**
 * 更改appName
 */
export const updateAppName = (para) => {
    return ajaxRequest.put(`${environment.dashboardApi}/api/v1/appInfo/UpdateAppName`, para);
};
/**
 * 获取当前siteId
 */
export const getCurSiteId = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/v1/userInfo/GetCurrentSiteId`);
};
/**
 * 更改siteName
 */
export const updateSiteName = (siteId, siteName) => {
    let para = { siteId: siteId, siteName: siteName }
    console.log(siteId, para);
    return ajaxRequest.put(`${environment.pageApi}/api/v1/siteInfo/UpdateSiteName`, para);
};
/**
* 更改站点语言
*/
export const updateSiteLanguage = (siteId, language) => {
    let para = { siteId: siteId, language: language }
    return ajaxRequest.put(`${environment.pageApi}/api/v1/siteInfo/UpdateSiteLanguage`, para);
};
/**
 * 获取site列表
 */
export const getSites = () => {
    return ajaxRequest.get(`${environment.pageApi}/api/v1/siteInfo/GetSites`);
}
/**
 * 获取app信息
 */
export const getApplication = () => {
    return ajaxRequest.get(`${environment.pageApi}/api/v1/appInfo/GetApplication`);
}

/**
 * 获取设计秘籍列表，版本更新列表，应用推荐列表
 */
export const getAppExpandInfo = () => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/v1/appInfo/GetAppExpandInfo`);
}

/**
 * 获取app列表
 */
export const getApplicationsByUserId = (appName) => {
    return ajaxRequest.get(`${environment.dashboardApi}/api/v1/appInfo/GetApplicationsByUserId`,{appName:appName});
}
/**
 * 切换app记录appId
 */
export const updateUserLastAppIdAndCookie = (appId) => {    
    return ajaxRequest.post(`${environment.dashboardApi}/api/v1/userInfo/UpdateUserLastAppIdAndCookie/${appId}`);
}
/**
 * 切换site记录siteId
 */
export const updateUserLastSiteId = (siteId) => {
    return ajaxRequest.put(`${environment.dashboardApi}/api/v1/userInfo/UpdateUserLastSiteId`, siteId);
}
// 获取自动翻译开关是否展示
export const showTranslateSwitch = () => {
  return ajaxRequest.get(`${environment.dashboardApi}/api/v1/SiteInfo/ShowTranslateSwitch`);
};
// 切换自动翻译状态
export const switchAutoTranslateStatus = () => {
  return ajaxRequest.put(`${environment.designerManageApi}/api/v1/Page/SwitchAutoTranslateStatus`);
};
// 获取自动翻译状态
export const getAutoTranslateConfig = () => {
  return ajaxRequest.get(`${environment.designerManageApi}/api/v1/Page/GetAutoTranslateConfig`);
};


