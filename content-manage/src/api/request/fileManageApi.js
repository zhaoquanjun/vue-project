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
    return ajaxRequest.get(`/api/v1/File/GetList`, options);
}
export const batchRemove = (isDelete, idList) => {
    return ajaxRequest.put(`/api/v1/File/ChangeDeleteStatus/${isDelete}`, idList);
}

export const changeCategory = (categoryId, idList) => {
    return ajaxRequest.put(`/api/v1/File/ChangeCategory/${categoryId}`, idList);
}

export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/v1/File/${id}`, JSON.stringify(newName));
}
// 下载文件
export const download = option => {
    return ajaxRequest.put(`api/v1/Download/${option.type}/${option.appId}/${option.id}`, JSON.stringify('123'));
}
export const switchIsTopStatus = (isTop, idList) => {
    return ajaxRequest.put(`/api/v1/File/SwitchIsTopStatus/${isTop}`, idList);
}
// 设置文件密码

export const batchSetPwd = (params) => {
    return ajaxRequest.put(`/api/v1/File/BatchSetPwd`, params);
}