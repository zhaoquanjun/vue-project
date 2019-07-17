import * as ajaxRequest from "../ajaxRequest";

export const get = () => {
    return ajaxRequest.get(`/api/PictureCategory`);
}
export const create = entity => {
    return ajaxRequest.post(`/api/PictureCategory`, entity);
}
export const batchRemove = idList => {
    return ajaxRequest._delete(`/api/PictureCategory`, { data: idList });
}
export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/PictureCategory/${id}`, JSON.stringify(newName));
}
export const modifyNode = (id, parentId, idOrderByArr) => {
    return ajaxRequest.put(`/api/PictureCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}


