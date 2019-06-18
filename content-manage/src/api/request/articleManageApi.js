import * as ajaxRequest from "../ajaxRequest";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取文章列表
 * @param {*} option 
 */
// 获取文章列表
export const getArticleList = (options) => {
    return ajaxRequest.get(`/api/News/GetCategoryTree/${options.pageIndex}/${options.pageSize}`,options);
}
// 批量删除
export const batchRemove = (isDelete, idList) => {
    return ajaxRequest.put(`/api/News/ChangeNewsDeleteStatus/${isDelete}`, idList);
}
// 批量置顶
export const batchTop = (topStatus, idList) => {
    return ajaxRequest.put(`/api/News/TopNews/${topStatus}`, idList);
}
// 批量上下线
export const batchPublish = (publishStatus, idList) => {
    return ajaxRequest.put(`/api/News/PublishNews/${publishStatus}`, idList);
}
// 批量移动
export const batchMove = (targetCategoryId, idList) => {
    return ajaxRequest.put(`/api/News/MoveNews/${targetCategoryId}`, idList);
}