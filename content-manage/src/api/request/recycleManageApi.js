import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "../../environment/index" 


// 获取文章列表
export const getArticleList = (options) => {
    return ajaxRequest.get(`/api/v1/News/GetRecycleNewsList/${options.pageIndex}/${options.pageSize}`,options);
}

// 批量恢复文章
export const newsBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/v1/News/ChangeNewsDeleteStatus/${isDelete}`, idList);
}

/**
 * 获取产品列表
 * @param {*} option 
 */
export const getProductList = options => {
    return ajaxRequest.get(`/api/v1/product/GetList`, options);
}

/**
 * 
批量切换产品的状态  删除| 置顶状态 |  上下架状态
 */

export const batchSwitchStatus = options => {
    return ajaxRequest.put(`/api/v1/product/BatchSwitchStatus/${options.switchType}/${options.flag}`, options.idList);
}

/**
 * 获取文件列表
 * @param {*} option 
 */
export const getFileList = options => {
    return ajaxRequest.get(`/api/v1/File/GetList`, options);
}
export const fileBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/v1/File/ChangeDeleteStatus/${isDelete}`, idList);
}
/**
 * 获取视频列表
 * @param {*} option 
 */
export const getVideoList = options => {
    return ajaxRequest.get(`/api/v1/Video/GetList`, options);
}
export const videoBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/v1/Video/ChangeDeleteStatus/${isDelete}`, idList);
}

/**
 * 获取音频列表
 * @param {*} option 
 */
export const getAudioList = options => {
    return ajaxRequest.get(`/api/v1/Audio/GetList`, options);
}
export const audioBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/v1/Audio/ChangeDeleteStatus/${isDelete}`, idList);
}

/**
 * 获取图片列表
 * @param {*} option 
 */
export const getPicList = options => {
    return ajaxRequest.get(`/api/v1/Picture/GetList`, options);
}
export const picBatchRecovery = (isDelete, idList) => {
    return ajaxRequest.put(`/api/v1/Picture/ChangeDeleteStatus/${isDelete}`, idList);
}

/**
 * 获取页面列表
 * @param {*} option 
 */
export const getPageList = options => {
    return ajaxRequest.get(`${enbironmemy.designerManageApi}/api/v1/Page/GetRecyclePageList`, options);
}
export const pageRecovery = options => {
    return ajaxRequest.put(`${enbironmemy.designerManageApi}/api/v1/Page/RestorePage`, options);
}