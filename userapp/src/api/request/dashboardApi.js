import environment from "@/environment/index";

import * as ajaxRequest from "../ajaxRequest";

/**
 * 更改appName
 */
export const UpdateAppName = (appName) => {
    return ajaxRequest.put(`${environment.memberManageApi}/api/appInfo/UpdateAppName`, JSON.stringify(appName));
};
/**
 * 获取当前siteId
 */
export const getCurSiteId = () => {
    return ajaxRequest.get(`${environment.memberManageApi}/api/userInfo/GetCurrentSiteId`);
};
/**
 * 更改siteName
 */
export const updateSiteName = (siteId, siteName) => {
    let para = { siteId: siteId, siteName: siteName }
    console.log(siteId, para);
    return ajaxRequest.put(`${environment.designerManageApi}/api/siteInfo/UpdateSiteName`, para);
};
/**
* 更改站点语言
*/
export const updateSiteLanguage = (siteId, language) => {
    let para = { siteId: siteId, language: language }
    return ajaxRequest.put(`${environment.designerManageApi}/api/siteInfo/UpdateSiteLanguage`, para);
};
/**
 * 获取site列表
 */
export const getSites = () => {
    return ajaxRequest.get(`${environment.designerManageApi}/api/siteInfo/GetSites`);
}
/**
 * 获取app信息
 */
export const getApplication = () => {
    return ajaxRequest.get(`${environment.designerManageApi}/api/appInfo/GetApplication`);
}

/**
 * 获取设计秘籍列表，版本更新列表，应用推荐列表
 */
export const getAppExpandInfo = () => {
    return ajaxRequest.get(`${environment.memberManageApi}/api/appInfo/GetAppExpandInfo`);
}

/**
 * 获取app列表
 */
export const getApplicationsByUserId = () => {
    return ajaxRequest.get(`${environment.memberManageApi}/api/appInfo/GetApplicationsByUserId`);
}
/**
 * 切换app记录appId
 */
export const updateUserLastAppIdAndCookie = (appId) => {    
    return ajaxRequest.post(`${environment.memberManageApi}/api/userInfo/UpdateUserLastAppIdAndCookie/${appId}`);
}
/**
 * 切换site记录siteId
 */
export const updateUserLastSiteId = (siteId) => {
    return ajaxRequest.put(`${environment.memberManageApi}/api/userInfo/UpdateUserLastSiteId`, siteId);
}

/**
 * 获取用户头像 
 */
export const getAppHeadInfo = () => {
    return ajaxRequest.get(`${environment.memberManageApi}/api/appInfo/GetAppHeadInfo`);
}

/**
 *desc:获取第一行业
 * author:xuzhuan
 * time:2019.08.05
 **/
export const GetFirstIndustries = () => {
    return ajaxRequest.get(`${environment.designerManageApi}/api/siteInfo/GetFirstIndustries`);
}

/**
 *desc:获取第一行业
 * author:xuzhuan
 * time:2019.08.05
 **/
export const GetSecondIndustries = (parentId) => {
    let para = { firstIndustryId: parentId };
    return ajaxRequest.get(`${environment.designerManageApi}/api/siteInfo/GetSecondIndustries`, para);
}
/**
 * 保存网站类型和所属行业
 */
export const updateSiteTypeAndIndustry = (siteId, siteType, firstIndustryId, secondIndustryId) => {
    let para = { siteId: siteId, siteType: siteType, firstIndustryId: firstIndustryId, secondIndustryId: secondIndustryId };
    return ajaxRequest.put(`${environment.designerManageApi}/api/siteInfo/UpdateSiteTypeAndIndustry`, para);
}

/**
 *desc:创建站点
 * author:xuzhuan
 * time:2019.08.08
 **/
export const CreateSite = (language, siteName) => {
    let para = { language: language, siteName: siteName};
    return ajaxRequest.post(`${environment.memberManageApi}/api/siteInfo/CreateSite`, para);
}