import * as ajaxRequest from "../ajaxRequest";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取列表
 * @param {*} option 
 */
export const getList = options => {
    return ajaxRequest.get(`/api/v1/Audio/GetList`, options);
}
export const batchRemove = (isDelete, idList) => {
    return ajaxRequest.put(`/api/v1/Audio/ChangeDeleteStatus/${isDelete}`, idList);
}

export const changeCategory = (categoryId, idList) => {
    return ajaxRequest.put(`/api/v1/Audio/ChangeCategory/${categoryId}`, idList);
}

export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/v1/Audio/${id}`, JSON.stringify(newName));
}