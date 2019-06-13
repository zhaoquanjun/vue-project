import * as ajaxRequest from "../ajaxRequest";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取图片列表
 * @param {*} option 
 */
export const getPicList = (options) => {
    return ajaxRequest.get(`/api/Picture/${options.pageIndex}/${options.pageSize}`, options);
}
export const batchRemove = (idList) => {
    return ajaxRequest._delete(`/api/Picture`, idList);
}