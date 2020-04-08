import * as ajaxRequest from "../ajaxRequest";

export const get = options => {
  return ajaxRequest.get(`/api/v1/ProductCategory`, options);
};
export const create = entity => {
  return ajaxRequest.post(`/api/v1/ProductCategory`, entity);
};
export const batchRemove = idList => {
  return ajaxRequest._delete(`/api/v1/ProductCategory`, { data: idList });
};
export const update = (id, newName, thumbnailPicUrl) => {
  return ajaxRequest.put(`/api/v1/ProductCategory/${id}`, {
    DisplayName: newName,
    ThumbnailPicUrl: thumbnailPicUrl
  });
};
export const modifyNode = (id, parentId, idOrderByArr) => {
  return ajaxRequest.put(
    `/api/v1/ProductCategory/ModifyNode/${id}/${parentId}`,
    idOrderByArr
  );
};
