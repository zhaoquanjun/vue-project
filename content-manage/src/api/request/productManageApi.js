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
 * 修改分类
 * @param {*} options 
 */
export const batchChangeCategory = options => {
    return ajaxRequest.put(`/api/product/BatchChangeCategory`, options);
}
/**
 * 新建产品
 * @param {*} options 
 */
export const createProduct = options => {
    return ajaxRequest.post(`/api/Product`, options);
}

/**
 * 
 * @param {String} id 当前产品的id 
 */

export const update = (id, options) => {
    return ajaxRequest.put(`/api/Product/Update/${id}`, options);
}

/**
 * 获取产品详情
 * @param {*} options 
 */
export const getProductDetail = id => {
    return ajaxRequest.get(`/api/Product/${id}`);
}



/**
 * 复制产品
 * @param {*} options 
 */
export const copyBatchProduct = options => {
    return ajaxRequest.post(`/api/Product/BatchCopy`, options);
}