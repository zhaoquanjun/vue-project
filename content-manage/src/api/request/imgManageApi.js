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
export const getPicList = options => {
    return ajaxRequest.get(`/api/Picture/GetList`, options);
}
export const batchRemove = (isDelete, idList) => {
    return ajaxRequest.put(`/api/Picture/ChangeDeleteStatus/${isDelete}`, idList);
}

export const changeCategory = (categoryId, idList) => {
    return ajaxRequest.put(`/api/Picture/ChangeCategory/${categoryId}`, idList);
}

export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/Picture/${id}`, JSON.stringify(newName));
}