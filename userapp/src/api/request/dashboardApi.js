import * as ajaxRequest from "../ajaxRequest";

/**
 * 更改appName
 */
export const UpdateAppName = (appName) => {
    return ajaxRequest.put(`/api/appInfo/UpdateAppName`, JSON.stringify(appName));
};
/**
 * 获取当前siteId
 */
export const getCurSiteId = () => {
    return ajaxRequest.get(`/api/userInfo/GetCurrentSiteId`);
};
/**
 * 更改siteName
 */
export const updateSiteName = (siteId, siteName) => {
    let para = { siteId: siteId, siteName: siteName }
    return ajaxRequest.put(`/api/siteInfo/UpdateSiteName`, para);
};
/**
* 更改站点语言
*/
export const updateSiteLanguage = (siteId, language) => {
    return ajaxRequest.put(`/api/siteInfo/UpdateSiteLanguage`, JSON.stringify(appName));
};
/**
 * 获取site列表
 */
export const getSites = () => {
    return ajaxRequest.get(`/api/siteInfo/GetSites`);
}
/**
 * 获取app信息
 */
export const getApplication = () => {
    return ajaxRequest.get(`/api/appInfo/GetApplication`);
}
/**
 * 获取版本更新信息
 */
export const getVersions = () => {
    return ajaxRequest.get(`/api/appInfo/GetVersions`);
}
/**
 * 获取应用推荐列表
 */
export const getRecommends = () => {
    return ajaxRequest.get(`/api/appInfo/GetRecommends`);
}

/**
 * 获取设计秘籍列表，版本更新列表，应用推荐列表
 */
export const getAppExpandInfo = () => {
    return ajaxRequest.get(`/api/appInfo/GetAppExpandInfo`);
}

/**
 * 获取app列表
 */
export const getApplicationsByUserId = () => {
    return ajaxRequest.get(`/api/appInfo/GetApplicationsByUserId`);
}
/**
 * 切换app记录appId
 */
export const updateUserLastAppIdAndCookie = (appId) => {
    return ajaxRequest.put(`/api/userInfo/UpdateUserLastAppIdAndCookie`, JSON.stringify(appId));
}
/**
 * 切换site记录siteId
 */
export const updateUserLastSiteId = (siteId) => {
    return ajaxRequest.put(`/api/userInfo/UpdateUserLastSiteId`, siteId);
}

/**
 * 获取用户头像 
 */
export const getAppHeadInfo = () => {
    return ajaxRequest.get(`/api/appInfo/GetAppHeadInfo`);
}

/**
 *desc:获取第一行业
 * author:xuzhuan
 * time:2019.08.05
 **/
export const GetFirstIndustries = () => {
    return ajaxRequest.get(`/api/siteInfo/GetFirstIndustries`);
}

/**
 *desc:获取第一行业
 * author:xuzhuan
 * time:2019.08.05
 **/
export const GetSecondIndustries = (parentId) => {
    let para = { firstIndustryId: parentId };
    return ajaxRequest.get(`/api/siteInfo/GetSecondIndustries`, para);
}
/**
 * 保存网站类型和所属行业
 */
export const updateSiteTypeAndIndustry = (siteId, siteType, firstIndustryId, secondIndustryId) => {
    let para = { siteId: siteId, siteType: siteType, firstIndustryId: firstIndustryId, secondIndustryId: secondIndustryId };
    return ajaxRequest.get(`/api/siteInfo/UpdateSiteTypeAndIndustry`, para);
}

/**
 *desc:更新site名称
 * author:xuzhuan
 * time:2019.08.05
 **/
export const updateSiteName = (siteId, siteName) => {

    return ajaxRequest.put(`/api/siteInfo/UpdateSiteName`, JSON.stringify(siteId), JSON.stringify(siteName));
}