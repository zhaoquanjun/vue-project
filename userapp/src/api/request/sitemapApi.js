import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js";
/**
 * 站点地图上传文件
 */
// 是否已上传sitemap.xml
export const hasUploadFile = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/SiteMapFile/HasUploadFile/${siteId}`);
}
// 获取sitemap文件内容
export const preview = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/SiteMapFile/Preview/${siteId}`);
}
// 新增或者覆盖现有的sitemap文件
export const addOrOverride = (siteId) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/v1/SiteMapFile/AddOrOverride/${siteId}`);
}
// 
export const remove = (siteId) => {
    return ajaxRequest._delete(`${enbironmemy.siteManageApi}/api/v1/SiteMapFile/Remove/${siteId}`);
}
/**
 * 站点地图页面
 */
// 获取sitemap列表
export const getList = (siteId, para) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/SiteMap/GetList/${siteId}`, para);
}
// 获取添加实体的列表,0页面,1新闻,2产品
export const getRefEntityList = (siteId, para) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/SiteMap/GetRefEntityList/${siteId}`, para);
}
// 新增
export const add = (para) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/v1/SiteMap/Add`, para);
}
// 修改,传空时不会改变原有值
export const update = (siteId) => {
    return ajaxRequest.put(`${enbironmemy.siteManageApi}/api/v1/SiteMap/Update/${siteId}`);
}
// 删除
export const batchRemove = (siteId, para) => {
    return ajaxRequest._delete(`${enbironmemy.siteManageApi}/api/v1/SiteMap/BatchRemove/${siteId}`, { data: para});
}