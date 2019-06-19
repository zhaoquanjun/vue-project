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
export const getArticleList = (options) => {
    return ajaxRequest.get(`/api/News/GetCategoryTree/${options.pageIndex}/${options.pageSize}`,options);
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

