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
export const getPicList = options => {
    return ajaxRequest.get(`/api/Audio/GetList`, options);
}
export const batchRemove = (isDelete, idList) => {
    return ajaxRequest.put(`/api/Audio/ChangeDeleteStatus/${isDelete}`, idList);
}

export const changeCategory = (categoryId, idList) => {
    return ajaxRequest.put(`/api/Audio/ChangeCategory/${categoryId}`, idList);
}

export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/Audio/${id}`, JSON.stringify(newName));
}