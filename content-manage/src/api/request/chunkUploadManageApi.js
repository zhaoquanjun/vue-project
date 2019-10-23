import * as ajaxRequest from "../ajaxRequest";

export const createFileWithoutUpload = (data) => {
    return ajaxRequest.post(`/api/v1/ChunkUpload/CreateFileWithoutUpload`, (data));
}