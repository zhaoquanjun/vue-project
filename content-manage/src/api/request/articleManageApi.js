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
    return ajaxRequest.get(`/api/News/GetNewsList/${options.pageIndex}/${options.pageSize}`,options);
}
// 获取文章詳情
export const getArticleDetail = (options) => {
    return ajaxRequest.get(`/api/News/GetNewDetail/${options}`);
}
// 创建文章
export const createArticle = (options) => {
    return ajaxRequest.post(`/api/News/CreateNews`, options);
}
// 创建文章
export const editArticle = (options) => {
    return ajaxRequest.put(`/api/News/EditNews`, options);
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

/**
 * 获取文章分类
 */
export const getArticleCategory = () => {
    return ajaxRequest.get(`/api/NewsCategory/GetTree`);
}

/**
 * 重命名文章分类
 * @param {*} id 
 * @param {*} newName 
 */
export const reName = (id, newName) => {
    console.log(id);
    console.log(newName);
    return ajaxRequest.put(`/api/NewsCategory/EditName`,{ CategoryId: id, CategoryName: newName });
}


/**
 * 新增文章分类
 * @param {*} entity 
 */
export const create = entity => {
    return ajaxRequest.post(`/api/NewsCategory/Create`, entity );
}

/**
 * 删除文章分类
 * @param {*} idList 
 */
export const deleteNewsCategory = (idList) => {
    return ajaxRequest._delete(`/api/NewsCategory/Delete`,  { data: idList } );
}
