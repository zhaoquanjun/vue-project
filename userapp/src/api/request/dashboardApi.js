import * as ajaxRequest from "../ajaxRequest";

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