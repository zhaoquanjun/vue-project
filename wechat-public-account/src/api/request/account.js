import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

/**
 * 
 * @param {*} params Object {appId, 授权方 - （微信公众号/服务号/订阅号）/小程序/支付宝小程序（微信公众号/服务号/订阅号）}
 */
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

export const getMenuTree = options => {
  return ajaxRequest.get(`${environment.wechataccountApi}/api/CustomDefineMenu/GetMenuTree/${options.platformAppId}`, options);
}
