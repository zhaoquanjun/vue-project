import * as ajaxRequest from "../ajaxRequest";

export const get = () => {
    return ajaxRequest.get(`/api/v1/PictureCategory`);
}
export const create = entity => {
    return ajaxRequest.post(`/api/v1/PictureCategory`, entity);
}
export const batchRemove = idList => {
    return ajaxRequest._delete(`/api/v1/PictureCategory`, { data: idList });
}
export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/v1/PictureCategory/${id}`, JSON.stringify(newName));
}
export const modifyNode = (id, parentId, idOrderByArr) => {
    return ajaxRequest.put(`/api/v1/PictureCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}


