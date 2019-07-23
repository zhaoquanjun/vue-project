import * as ajaxRequest from "../ajaxRequest";

export const get = () => {
    return ajaxRequest.get(`/api/fileCategory`);
}
export const create = entity => {
    return ajaxRequest.post(`/api/fileCategory`, entity);
}
export const batchRemove = idList => {
    return ajaxRequest._delete(`/api/fileCategory`, { data: idList });
}
export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/fileCategory/${id}`, JSON.stringify(newName));
}
export const modifyNode = (id, parentId, idOrderByArr) => {
    return ajaxRequest.put(`/api/fileCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}


