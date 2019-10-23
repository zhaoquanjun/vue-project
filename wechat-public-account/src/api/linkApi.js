import * as ajaxRequest from "./ajaxRequest";
import environment from '../environment';

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
  return ajaxRequest.get(`${environment.pageApiUri}/api/v1/Page/GetContentPageList`, options);
}
export const getContentList = options => {
  return ajaxRequest.get(`${environment.pageApiUri}/api/v1/WeiXin/GetPageList`, options);
}

export const getArticleList = (options) => {
  return ajaxRequest.get(`${environment.contentApiUri}/api/v1/News/GetNewsList/${options.pageIndex}/${options.pageSize}`,options);
}

export const getArticleCategory = () => {
  return ajaxRequest.get(`${environment.contentApiUri}/api/v1/NewsCategory/GetTree`);
}

export const getProductList = options => {
  return ajaxRequest.get(`${environment.contentApiUri}/api/v1/product/GetList`, options);
}

export const getProductCategory = () => {
  return ajaxRequest.get(`${environment.contentApiUri}/api/v1/ProductCategory`);
}

export const getFileCategory  = () => {
  return ajaxRequest.get(`${environment.contentApiUri}/api/v1/FileCategory`);
}

export const getFileList = options => {
  return ajaxRequest.get(`${environment.contentApiUri}/api/v1/file/GetList`, options);
}