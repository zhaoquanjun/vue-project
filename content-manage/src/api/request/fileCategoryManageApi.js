import * as ajaxRequest from "../ajaxRequest";

export const get = () => {
    return ajaxRequest.get(`/api/v1/fileCategory`);
}
export const create = entity => {
    return ajaxRequest.post(`/api/v1/fileCategory`, entity);
}
export const batchRemove = idList => {
    return ajaxRequest._delete(`/api/v1/fileCategory`, { data: idList });
}
export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/v1/fileCategory/${id}`, JSON.stringify(newName));
}
export const modifyNode = (id, parentId, idOrderByArr) => {
    return ajaxRequest.put(`/api/v1/fileCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}


