import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";
// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 跳转链接接口
 * @param {*} option 
 */
export const getPagesList = options => {
    return ajaxRequest.get(`${environment.designerManageApi}/api/v1/Page/GetContentPageList`, options);
}

export const getArticleList = (options) => {
    return ajaxRequest.get(`/api/v1/News/GetNewsList/${options.pageIndex}/${options.pageSize}`, options);
}

export const getArticleCategory = () => {
    return ajaxRequest.get(`/api/v1/NewsCategory/GetTree`);
}

export const getProductList = options => {
    return ajaxRequest.get(`/api/v1/product/GetList`, options);
}

export const getProductCategory = () => {
    return ajaxRequest.get(`/api/v1/ProductCategory`);
}

export const getFileCategory = () => {
    return ajaxRequest.get(`/api/v1/FileCategory`);
}

export const getFileList = options => {
    return ajaxRequest.get(`/api/v1/file/GetList`, options);
}

export const getPageDetail = options => {
    return ajaxRequest.get(`${environment.designerManageApi}/api/v1/Page/GetPageList`, options);
}