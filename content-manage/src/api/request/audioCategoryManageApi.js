import * as ajaxRequest from "../ajaxRequest";

export const get = () => {
    return ajaxRequest.get(`/api/audioCategory`);
}
export const create = entity => {
    return ajaxRequest.post(`/api/audioCategory`, entity);
}
export const batchRemove = idList => {
    return ajaxRequest._delete(`/api/audioCategory`, { data: idList });
}
export const rename = (id, newName) => {
    return ajaxRequest.put(`/api/audioCategory/${id}`, JSON.stringify(newName));
}
export const modifyNode = (id, parentId, idOrderByArr) => {
    return ajaxRequest.put(`/api/audioCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}


