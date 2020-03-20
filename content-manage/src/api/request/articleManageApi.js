import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取文章列表
 * @param {*} option
 */
// 获取文章列表
export const getArticleList = options => {
  return ajaxRequest.get(
    `/api/v1/News/GetNewsList/${options.pageIndex}/${options.pageSize}`,
    options
  );
};
// 获取文章詳情
export const getArticleDetail = options => {
  return ajaxRequest.get(`/api/v1/News/GetNewDetail/${options}`);
};
// 创建文章
export const createArticle = options => {
  return ajaxRequest.post(`/api/v1/News/CreateNews`, options);
};
// 创建文章
export const editArticle = options => {
  return ajaxRequest.put(`/api/v1/News/EditNews`, options);
};
// 批量删除
export const batchRemove = (isDelete, idList) => {
  return ajaxRequest.put(
    `/api/v1/News/ChangeNewsDeleteStatus/${isDelete}`,
    idList
  );
};
// 批量置顶
export const batchTop = (topStatus, idList) => {
  return ajaxRequest.put(`/api/v1/News/TopNews/${topStatus}`, idList);
};
// 批量上下线
export const batchPublish = (publishStatus, idList) => {
  return ajaxRequest.put(`/api/v1/News/PublishNews/${publishStatus}`, idList);
};
// 批量移动
export const batchMove = (targetCategoryId, idList) => {
  return ajaxRequest.put(`/api/v1/News/MoveNews/${targetCategoryId}`, idList);
};
// 批量复制
export const batchCopy = (targetCategoryId, idList) => {
  return ajaxRequest.post(`/api/v1/News/CopyNews/${targetCategoryId}`, idList);
};

/**
 * 获取文章分类
 */
export const getArticleCategory = () => {
  return ajaxRequest.get(`/api/v1/NewsCategory/GetTree`);
};

/**
 * 重命名文章分类
 * @param {*} id
 * @param {*} newName
 */
export const reName = (id, newName) => {
  console.log(id);
  console.log(newName);
  return ajaxRequest.put(`/api/v1/NewsCategory/EditName`, {
    CategoryId: id,
    CategoryName: newName
  });
};

/**
 * 新增文章分类
 * @param {*} entity
 */
export const create = entity => {
  return ajaxRequest.post(`/api/v1/NewsCategory/Create`, entity);
};

/**
 * 删除文章分类
 * @param {*} idList
 */
export const deleteNewsCategory = idList => {
  return ajaxRequest._delete(`/api/v1/NewsCategory/Delete`, { data: idList });
};
//拖拽移动分类
export const modifyNode = (id, parentId, idOrderByArr) => {
  return ajaxRequest.put(
    `/api/v1/NewsCategory/ModifyNode/${id}/${parentId}`,
    idOrderByArr
  );
};
/**
 * 获取文章产品预览地址
 */
export const GetContentPrevAddress = (pageType, siteId) => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/Page/GetContentPrevAddress/${pageType}`,
    { siteId: siteId }
  );
};

/**
 * 获取站点下拉列表
 */
export const getSiteList = () => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/siteInfo/GetSites`
  );
};

/**
 *
 * @name 翻译单篇文章
 * @param {*} options 翻译id 目标语言  站点id
 */
export const translateSignalNews = options => {
  return ajaxRequest.post(`/api/v1/News/Translate`, options);
};

/**
 *
 * @name 翻译批量文章
 * @param {*} options 翻译id 目标语言  站点id
 */
export const translateMoreNews = options => {
  return ajaxRequest.post(`/api/v1/News/MultilingualTranslate`, options);
};

/**
 *
 * @name 获取文章翻译进度
 * @param {*} translateId 翻译id
 */
export const getNewsTranslateProcess = translateId => {
  return ajaxRequest.get(`/api/v1/News/GetTranslateProgress/${translateId}`);
};

/**
 * @name 是否已经存在文章翻译
 */
export const isHasTranslateProcess = () => {
  return ajaxRequest.get(`/api/v1/news/IsExistTranslateProcess`);
};

/**
 *
 * @name 获取文章是否翻译过
 * @param {*} id 文章id
 */
export const newsTranslateStatus = id => {
  return ajaxRequest.get(`/api/v1/News/GetTranslatedList/${id}`);
};
