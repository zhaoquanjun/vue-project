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
export const getArticalList = (options) => {
    return ajaxRequest.get(`/api/News/GetCategoryTree/${options.pageIndex}/${options.pageSize}`,options);
}