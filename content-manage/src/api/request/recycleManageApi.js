import * as ajaxRequest from "../ajaxRequest";


// 获取文章列表
export const getArticleList = (options) => {
    return ajaxRequest.get(`/api/News/GetRecycleNewsList/${options.pageIndex}/${options.pageSize}`,options);
}

// 批量恢复文章
export const newsBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/News/ChangeNewsDeleteStatus/${isDelete}`, idList);
}

/**
 * 获取产品列表
 * @param {*} option 
 */
export const getProductList = options => {
    return ajaxRequest.get(`/api/product/GetList`, options);
}

/**
 * 
批量切换产品的状态  删除| 置顶状态 |  上下架状态
 */

export const batchSwitchStatus = options => {
    return ajaxRequest.put(`/api/product/BatchSwitchStatus/${options.switchType}/${options.flag}`, options.idList);
}

/**
 * 获取文件列表
 * @param {*} option 
 */
export const getFileList = options => {
    return ajaxRequest.get(`/api/File/GetList`, options);
}
export const fileBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/File/ChangeDeleteStatus/${isDelete}`, idList);
}
/**
 * 获取视频列表
 * @param {*} option 
 */
export const getVideoList = options => {
    return ajaxRequest.get(`/api/Video/GetList`, options);
}
export const videoBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/Video/ChangeDeleteStatus/${isDelete}`, idList);
}

/**
 * 获取音频列表
 * @param {*} option 
 */
export const getAudioList = options => {
    return ajaxRequest.get(`/api/Audio/GetList`, options);
}
export const audioBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/Audio/ChangeDeleteStatus/${isDelete}`, idList);
}

/**
 * 获取图片列表
 * @param {*} option 
 */
export const getPicList = options => {
    return ajaxRequest.get(`/api/Picture/GetList`, options);
}
export const picBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/Picture/ChangeDeleteStatus/${isDelete}`, idList);
}