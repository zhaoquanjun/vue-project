import * as ajaxRequest from "../ajaxRequest";

export const get = () => {
    return ajaxRequest.get(`/api/videoCategory`);
}
export const create = entity => {
    return ajaxRequest.post(`/api/videoCategory`, entity);
}
export const batchRemove = idList => {
    return ajaxRequest._delete(`/api/videoCategory`, { data: idList });
}
export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/videoCategory/${id}`, JSON.stringify(newName));
}
export const modifyNode = (id, parentId, idOrderByArr) => {
    return ajaxRequest.put(`/api/videoCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}


