import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js";


// 获取会员列表
export const getMemberList = (options) => {
    return ajaxRequest.get(`${enbironmemy.memberManageApi}/api/v1/UserMember/GetMemberList`, options);
}
// 导出会员列表
export const exportMemberList = (options) => {
    return ajaxRequest.get(`${enbironmemy.memberManageApi}/api/v1/UserMember/ExportMemberList`, options);
}
// 获取会员详情
export const getMemberDetail = (id) => {
    return ajaxRequest.get(`${enbironmemy.memberManageApi}/api/v1/UserMember/GetMemberInfo`, { id: id });
}
// 编辑会员详情
export const editMemberDetail = (options) => {
    return ajaxRequest.put(`${enbironmemy.memberManageApi}/api/v1/UserMember/EditMember`, options);
}
// 删除会员
export const removeMember = (idList) => {
    return ajaxRequest._delete(`${enbironmemy.memberManageApi}/api/v1/UserMember/DeleteMember`, { data: idList});
}

/**
 * 获取站点下拉列表
 */
export const getSiteList = () => {
    return ajaxRequest.get(`${enbironmemy.designerManageApi}/api/v1/siteInfo/GetSites`);
}

