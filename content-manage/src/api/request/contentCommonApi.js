import * as ajaxRequest from "../ajaxRequest";

export const getStorageUsage = uploadFileType => {
    return ajaxRequest.get(`/api/ChunkUpload/GetStorageUsage/${uploadFileType}`);
}

export const adminDownload = (type, id) => {
    return ajaxRequest.put(`/api/Download/AdminDownload/${type}/${id}`);
}