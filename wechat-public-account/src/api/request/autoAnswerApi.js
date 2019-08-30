import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";


/**
 * 
 * @param {String} replyType 
 * 获取回复详情
 * 回复类型 1 被关注时回复 2 收到消息时回复
 * Available values : Follow, Receive
 */
export const getReplyDetail = replyType => {
    return ajaxRequest.get(`${environment.wechataccountApi}/api/v1/Reply/GetReplyDetail/${replyType}`);
}
/**
 * 获取关键词回复列表
 */
export const getKeywordReplyList = (option) => {
    return ajaxRequest.get(`${environment.wechataccountApi}/api/v1/Reply/GetKeywordReplyList`,option);
}
/**
 * 删除回复信息
 * @param {Int} id 
 */
export const removeReply = id => {
    return ajaxRequest._delete(`${environment.wechataccountApi}/api/v1/Reply/RemoveReply/${id}`);
}
/**
 * 删除关键词回复信息
 * @param {*} id 
 */
export const removeKeywordReply = id => {
    let param = [id]
    return ajaxRequest._delete(`${environment.wechataccountApi}/api/v1/Reply/BatchRemoveKeywordReply`,{data:param});
}

/**
 * 新增关键词回复信息
 */
export const addKeywordReply = (option) => {
    return ajaxRequest.post(`${environment.wechataccountApi}/api/v1/Reply/AddKeywordReply`,option);
}

/**
 * 新增或者覆盖回复信息
 * Available values : Follow, Receive
 * 回复类型 1 被关注时回复 2 收到消息时回复
 */
export const addOrOverrideReply = (option) => {
    console.log(option)
    return ajaxRequest.post(`${environment.wechataccountApi}/api/v1/Reply/AddOrOverrideReply/${option.replyType}/${option.msgType}`,option.content);
}
/**
 * 编辑关键词回复信息
 */
export const updateKeywordReply = (id) => {
    return ajaxRequest.put(`${environment.wechataccountApi}/api/v1/Reply/UpdateKeywordReply/${id}`);
}



