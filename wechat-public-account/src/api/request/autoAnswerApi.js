import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";
import store from "@/store/index";

/**
 * 
 * @param {String} replyType 
 * 获取回复详情
 * 回复类型 1 被关注时回复 2 收到消息时回复
 * Available values : Follow, Receive
 */
export const getReplyDetail = (SiteId, replyType) => {
    return ajaxRequest.get(`${environment.wechatApi}/api/v1/Reply/GetReplyDetail/${SiteId}/${replyType}`);
}
/**
 * 获取关键词回复列表
 */
export const getKeywordReplyList = (option) => {
    return ajaxRequest.get(`${environment.wechatApi}/api/v1/Reply/GetKeywordReplyList`,option);
}
/**
 * 删除回复信息
 * @param {Int} id 
 */
export const removeReply = (SiteId,id) => {
    return ajaxRequest._delete(`${environment.wechatApi}/api/v1/Reply/RemoveReply/${SiteId}/${id}`);
}
/**
 * 删除关键词回复信息
 * @param {*} id 
 */
export const removeKeywordReply = (id,SiteId) => {
    let param = [id]
    return ajaxRequest._delete(`${environment.wechatApi}/api/v1/Reply/BatchRemoveKeywordReply/${SiteId}`,{data:param});
}

/**
 * 新增关键词回复信息
 */
export const addKeywordReply = (option,siteid) => {
    return ajaxRequest.post(`${environment.wechatApi}/api/v1/Reply/AddKeywordReply/${siteid}`,option);
}

/**
 * 新增或者覆盖回复信息
 * Available values : Follow, Receive
 * 回复类型 1 被关注时回复 2 收到消息时回复
 */
export const addOrOverrideReply = (option) => {
    return ajaxRequest.post(`${environment.wechatApi}/api/v1/Reply/AddOrOverrideReply/${option.siteId}/${option.replyType}/${option.msgType}`,option.publicPlatformReplyInput);
}
/**
 * 编辑关键词回复信息
 */
export const updateKeywordReply = (option,id,SiteId) => {
    return ajaxRequest.put(`${environment.wechatApi}/api/v1/Reply/UpdateKeywordReply/${SiteId}/${id}`,option);
}



