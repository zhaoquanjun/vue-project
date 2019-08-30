import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 授权区域
export const isAuth = param => {
  return ajaxRequest.get(`${environment.wechataccountApi}/api/v1/Platform/SelectPlatformDetailAuth`);
  // return ajaxRequest.get(`${environment.wechataccountApi}/api/v1/OAuth/AuthRequest`);
}

export const wxAuth = () => {
  return ajaxRequest.get(`${environment.wechataccountApi}/api/v1/OAuth/getweixinauthurl`);
}

export const getPageSiteList = () => {
  return ajaxRequest.get(`${environment.pageApi}/api/v1/WeiXin/GetSiteList`);
}

// 链接区域
export const getPageData = param => {
  return ajaxRequest.get(`${environment.pageApi}/api/v1/WeiXin/GetPageList`);
}

export const getArticleList = (options) => {
  return ajaxRequest.get(`${environment.newsApi}/api/WeiXin/GetNewsList/${options.pageIndex}/${options.pageSize}`,options);
}

export const getArticleCategory = () => {
  return ajaxRequest.get(`${environment.newsApi}/api/WeiXin/GetNewsCategoryTree`);
}

export const getProductList = options => {
  return ajaxRequest.get(`${environment.newsApi}/api/WeiXin/GetProductList`, options);
}

export const getProductCategory = () => {
  return ajaxRequest.get(`${environment.newsApi}/api/WeiXin/GetProductCategoryTree`);
}

// 获取菜单树结构
export const getMenuTree = () => {
  return ajaxRequest.get(`${environment.wechataccountApi}/api/CustomDefineMenu/GetMenuTree`);
}
// 获取菜单单个详情
export const getMenuDetail = options => {
  return ajaxRequest.get(`${environment.wechataccountApi}/api/CustomDefineMenu/GetMenuDetail/${options.authorizerAppId}/${options.id}`);
}

// 图片区域
export const getPicList = options => {
  return ajaxRequest.get(`${environment.imageApi}/api/Picture/GetList`, options);
}
export const imgBatchRemove = (isDelete, idList) => {
  return ajaxRequest.put(`${environment.imageApi}/api/Picture/ChangeDeleteStatus/${isDelete}`, idList);
}

export const changeCategory = (categoryId, idList) => {
  return ajaxRequest.put(`${environment.imageApi}/api/Picture/ChangeCategory/${categoryId}`, idList);
}

export const imgRename = (id, newName) => {
  return ajaxRequest.put(`${environment.imageApi}/api/Picture/${id}`, JSON.stringify(newName));
}

export const get = () => {
  return ajaxRequest.get(`${environment.imageApi}/api/PictureCategory`);
}
export const create = entity => {
  return ajaxRequest.post(`${environment.imageApi}/api/PictureCategory`, entity);
}
export const batchRemove = idList => {
  return ajaxRequest._delete(`${environment.imageApi}/api/PictureCategory`, { data: idList });
}
export const rename = (id, newName) => {
  return ajaxRequest.put(`${environment.imageApi}/api/PictureCategory/${id}`, JSON.stringify(newName));
}
export const modifyNode = (id, parentId, idOrderByArr) => {
  return ajaxRequest.put(`${environment.imageApi}/api/PictureCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}

// 中转页面
export const transit = param => {
  return ajaxRequest.post(`${environment.wechataccountApi}/api/v1/oauth/success`, param);
}