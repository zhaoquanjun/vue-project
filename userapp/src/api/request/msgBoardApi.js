import environment from "@/environment/index";
import * as ajaxRequest from "../ajaxRequest";

/**
 * 获取留言列表
 */
export const getMsgboardList = (SiteId, PageIndex, PageSize, QueryKeywords, Status, DescSort) => {
  let paras = { SiteId: SiteId, PageIndex: PageIndex, PageSize: PageSize, QueryKeywords: QueryKeywords, Status: Status, DescSort:DescSort }
  return ajaxRequest.get(`${environment.memberManageApi}/api/v1/leaveword/list`, paras)
}

/**
 * 获取未读留言数量
 */
export const getUnReadCount = (SiteId) => {
  let para = { SiteId: SiteId }
  return ajaxRequest.get(`${environment.memberManageApi}/api/v1/leaveword/getUnReadCount`, para)
}

/**
 * 获取留言回复信息
 */
export const getReplyContent = (SiteId, leavewordId) => {
  let para = { SiteId: SiteId, leavewordId: leavewordId }
  return ajaxRequest.get(`${environment.memberManageApi}/api/v1/leaveword/getReply`, para)
}

/**
 * 回复留言列表
 */
export const setReplyContent = (SiteId, leavewordId, ReplyContent) => {
  let paras = { SiteId: SiteId, leavewordId: leavewordId, ReplyContent: ReplyContent }
  return ajaxRequest.post(`${environment.memberManageApi}/api/v1/leaveword/reply`, paras)
}

/**
 * 更改留言状态
 */
export const updateStatus = (SiteId, leavewordId, IsUpdateStatus, Status) => {
  let paras = { SiteId: SiteId, leavewordIds: leavewordId, IsUpdateStatus: IsUpdateStatus, Status: Status }
  return ajaxRequest.put(`${environment.memberManageApi}/api/v1/leaveword/update`, paras)
}

/**
 * 删除留言
 */
export const removeMsg = (SiteId, leavewordIds) => {
  return ajaxRequest._delete(`${environment.memberManageApi}/api/v1/leaveword/delete?leavewordIds=${leavewordIds}&SiteId=${SiteId}`)
}