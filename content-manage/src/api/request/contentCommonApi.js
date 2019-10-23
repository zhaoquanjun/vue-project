import * as ajaxRequest from "../ajaxRequest";

export const getStorageUsage = uploadFileType => {
    return ajaxRequest.get(`/api/v1/ChunkUpload/GetStorageUsage/${uploadFileType}`);
}

export const getCurrentUsageTraffic = uploadFileType => {
    return ajaxRequest.get(`/api/v1/ChunkUpload/GetCurrentUsageTraffic/${uploadFileType}`);
}
export const adminDownload = (type, id) => {
    return ajaxRequest.put(`/api/v1/Download/AdminDownload/${type}/${id}`);
}