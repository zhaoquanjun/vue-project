import * as ajaxRequest from "../ajaxRequest";

export const getStorageUsage = uploadFileType => {
    return ajaxRequest.get(`/api/ChunkUpload/GetStorageUsage/${uploadFileType}`);
}