import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";
import store from "@/store/index";

// 授权区域
export const isAuth = param => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/Platform/SelectPlatformDetailAuth`, param);
  // return ajaxRequest.get(`${environment.wechatApi}/api/v1/OAuth/AuthRequest`);
}

export const wxAuth = () => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/OAuth/getweixinauthurl`, { siteId: store.state.dashboard.siteId });
}


//解除绑定
export const unBind = () => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/OAuth/unbind`, {siteId: store.state.dashboard.siteId,infoType:'WeixinOA'});
}
//获取域名列表
export const getCdnDomainList = (siteId) => {
  return ajaxRequest.get(`${environment.pageApi}/api/v1/WeiXin/GetCdnDomainList/${siteId}`);
}
//设置绑定域名SetPromotionUrl
export const setPromotionUrl = (options) => {
  return ajaxRequest.put(`${environment.wechatApi}/api/v1/Platform/SetPromotionUrl`,options);
}
//添加域名bindDomain
export const bindDomain = (siteId,options) => {
  return ajaxRequest.post(`${environment.pageApi}/api/v1/WeiXin/BindDomainAndEnableCdn/${siteId}`,options);
}
export const getPageSiteList = () => {
  return ajaxRequest.get(`${environment.pageApi}/api/v1/WeiXin/GetSiteList`);
}

// 链接区域
export const getPageData = () => {
  return ajaxRequest.get(`${environment.pageApi}/api/v1/WeiXin/GetPageList`);
}

export const getArticleList = (options) => {
  return ajaxRequest.get(`${environment.newsApi}/api/v1/WeiXin/GetNewsList/${options.pageIndex}/${options.pageSize}`, options);
}

export const getArticleCategory = () => {
  return ajaxRequest.get(`${environment.newsApi}/api/v1/WeiXin/GetNewsCategoryTree`);
}

export const getProductList = options => {
  return ajaxRequest.get(`${environment.newsApi}/api/v1/WeiXin/GetProductList`, options);
}

export const getProductCategory = () => {
  return ajaxRequest.get(`${environment.newsApi}/api/v1/WeiXin/GetProductCategoryTree`);
}

// 获取菜单树结构
export const getMenuTree = (SiteId) => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/CustomDefineMenu/GetMenuTree/${SiteId}`);
}
// 获取菜单单个详情
export const getMenuDetail = (siteId, id) => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/CustomDefineMenu/GetMenuDetail/${siteId}/${id}`);
}
// 新增菜单
export const addMenu = options => {
  return ajaxRequest.post(`${environment.wechatApi}/api/v1/CustomDefineMenu/CreateMenu`,options);
}
// 保存并更新
export const updateMenu = options => {
  return ajaxRequest.put(`${environment.wechatApi}/api/v1/CustomDefineMenu/UpdateMenu`,options);
}
// 保存并发布
export const publishMenu = options => {
  return ajaxRequest.put(`${environment.wechatApi}/api/v1/CustomDefineMenu/PublishMenu`,options);
}
// 删除菜单
export const removeMenu = (siteId, id) => {
  return ajaxRequest._delete(`${environment.wechatApi}/api/v1/CustomDefineMenu/RemoveMenu/${siteId}/${id}`);
}
// 调整菜单排序
export const modifyMenuOrder = (siteId, options) => {
  return ajaxRequest.put(`${environment.wechatApi}/api/v1/CustomDefineMenu/ModifyMenuOrder/${siteId}`,options);
}

// 图片区域
export const getPicList = options => {
  return ajaxRequest.get(`${environment.imageApi}/api/v1/Picture/GetList`, options);
}
export const imgBatchRemove = (isDelete, idList) => {
  return ajaxRequest.put(`${environment.imageApi}/api/v1/Picture/ChangeDeleteStatus/${isDelete}`, idList);
}

export const changeCategory = (categoryId, idList) => {
  return ajaxRequest.put(`${environment.imageApi}/api/v1/Picture/ChangeCategory/${categoryId}`, idList);
}

export const imgRename = (id, newName) => {
  return ajaxRequest.put(`${environment.imageApi}/api/v1/Picture/${id}`, JSON.stringify(newName));
}

export const get = () => {
  return ajaxRequest.get(`${environment.imageApi}/api/v1/PictureCategory`);
}
export const create = entity => {
  return ajaxRequest.post(`${environment.imageApi}/api/v1/PictureCategory`, entity);
}
export const batchRemove = idList => {
  return ajaxRequest._delete(`${environment.imageApi}/api/v1/PictureCategory`, { data: idList });
}
export const rename = (id, newName) => {
  return ajaxRequest.put(`${environment.imageApi}/api/v1/PictureCategory/${id}`, JSON.stringify(newName));
}
export const modifyNode = (id, parentId, idOrderByArr) => {
  return ajaxRequest.put(`${environment.imageApi}/api/v1/PictureCategory/ModifyNode/${id}/${parentId}`, idOrderByArr);
}


// 中转页面
export const transit = param => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/oauth/success?${param}`);
}

export const uploadImg = (imgUrl) => {
  let params = {
    authorizerAppId: store.state.wxaccount.account_info.platformAppId,
    imgUrl
  }
  console.log(store)
  return ajaxRequest.post(`${environment.wechatApi}/api/v1/CustomDefineMenu/UploadImg`, params);
}

//微信推广
//新增微信推广
export const addShare = (siteId,options) => {
  return ajaxRequest.post(`${environment.wechatApi}/api/v1/WeChatShare/Add/${siteId}`, options);
}
//修改
export const updataShare = (siteId,id,options) => {
  return ajaxRequest.put(`${environment.wechatApi}/api/v1/WeChatShare/Update/${siteId}/${id}`, options);
}
//获取推广列表
export const getList = params => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/WeChatShare/GetList`, params);
}
//获取详情页下拉列表
export const getPageInfoList = (siteId, type) => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/WeChatShare/GetPageInfoList/${siteId}/${type}`);
}
//获取详情页下拉列表
export const remove = (siteId, id) => {
  return ajaxRequest._delete(`${environment.wechatApi}/api/v1/WeChatShare/Remove/${siteId}/${id}`);
} 
//获取微信分享数据
export const getStatistics = (siteId, shareId) => {
  return ajaxRequest.get(`${environment.wechatApi}/api/v1/WeChatShare/GetStatistics/${siteId}/${shareId}`);
}
