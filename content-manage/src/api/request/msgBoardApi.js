import environment from "@/environment/index";
import * as ajaxRequest from "../ajaxRequest";

/**
 * 获取留言列表
 */
export const getMsgboardList = (SiteId, PageIndex, PageSize, QueryKeywords, Status, DescSort) => {
  let paras = { SiteId: SiteId, PageIndex: PageIndex, PageSize: PageSize, QueryKeywords: QueryKeywords, Status: Status, DescSort:DescSort }
  return ajaxRequest.get(`${environment.dashboardApi}/api/v1/leaveword/list`, paras)
}

/**
 * 获取未读留言数量
 */
export const getUnReadCount = (SiteId) => {
  let para = { SiteId: SiteId }
  return ajaxRequest.get(`${environment.dashboardApi}/api/v1/leaveword/getUnReadCount`, para)
}

/**
 * 获取留言回复信息
 */
export const getReplyContent = (leavewordId) => {
  let para = { leavewordId: leavewordId }
  return ajaxRequest.get(`${environment.dashboardApi}/api/v1/leaveword/getReply`, para)
}

/**
 * 回复留言列表
 */
export const setReplyContent = (leavewordId, ReplyContent) => {
  let paras = { leavewordId: leavewordId, ReplyContent: ReplyContent }
  return ajaxRequest.post(`${environment.dashboardApi}/api/v1/leaveword/reply`, paras)
}

/**
 * 更改留言状态
 */
export const updateStatus = (leavewordId, IsUpdateStatus, Status) => {
  let paras = { leavewordIds: leavewordId, IsUpdateStatus: IsUpdateStatus, Status: Status }
  return ajaxRequest.put(`${environment.dashboardApi}/api/v1/leaveword/update`, paras)
}

/**
 * 删除留言
 */
export const removeMsg = (leavewordIds) => {
  return ajaxRequest._delete(`${environment.dashboardApi}/api/v1/leaveword/delete?leavewordIds=${leavewordIds}`)
}