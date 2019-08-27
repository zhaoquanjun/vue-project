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
    return ajaxRequest.get(`/api/Video/GetList`, options);
}
export const batchRemove = (isDelete, idList) => {
    return ajaxRequest.put(`/api/Video/ChangeDeleteStatus/${isDelete}`, idList);
}

export const changeCategory = (categoryId, idList) => {
    return ajaxRequest.put(`/api/Video/ChangeCategory/${categoryId}`, idList);
}

export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/Video/${id}`, JSON.stringify(newName));
}


///api/Download/{type}/{appId}/{id}
