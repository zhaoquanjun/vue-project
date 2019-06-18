import * as ajaxRequest from "../ajaxRequest";

export const get = () => {
    return ajaxRequest.get(`/api/ProductCategory`);
}
export const create = entity => {
    return ajaxRequest.post(`/api/ProductCategory`, entity);
}
export const batchRemove = idList => {
    return ajaxRequest._delete(`/api/ProductCategory`, { data: idList });
}
export const update = (id, newName, thumbnailPicUrl) => {
    return ajaxRequest.put(`/api/ProductCategory/${id}`, { DisplayName: newName, ThumbnailPicUrl: thumbnailPicUrl });
}
export const modifyNode = (id, parentId, idOrderByArr) => {
    return ajaxRequest.put(`/api/ProductCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}


