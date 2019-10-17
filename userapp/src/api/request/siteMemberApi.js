import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js";


// 获取会员列表
export const getMemberList = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/SiteMapFile/AddOrOverride/${siteId}`);
}
// 获取会员详情
export const getMemberDetail = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/SiteMapFile/AddOrOverride/${siteId}`);
}
// 编辑会员详情
export const editMemberDetail = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/SiteMapFile/AddOrOverride/${siteId}`);
}
// 删除会员
export const removeMember = (siteId) => {
    return ajaxRequest._delete(`${enbironmemy.siteManageApi}/api/v1/SiteMapFile/Remove/${siteId}`);
}
/**
 * 站点地图页面
 */

