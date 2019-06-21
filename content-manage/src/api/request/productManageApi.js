import * as ajaxRequest from "../ajaxRequest";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取产品列表
 * @param {*} option 
 */
export const getProductList = options => {
    return ajaxRequest.get(`/api/product/${options.pageIndex}/${options.pageSize}`, options);
}

/**
 * 
批量切换产品的状态  删除| 置顶状态 |  上下架状态
 */

export const batchSwitchStatus = options => {
    return ajaxRequest.put(`/api/product/BatchSwitchStatus/${options.switchType}/${options.flag}`, options.idList);
}

export const batchChangeCategory = options => {
    return ajaxRequest.put(`/api/product/BatchChangeCategory`, options);
}