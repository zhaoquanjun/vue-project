import * as ajaxRequest from "../ajaxRequest";

export const createFileWithoutUpload = (data) => {
    return ajaxRequest.post(`/api/ChunkUpload/CreateFileWithoutUpload`, (data));
}