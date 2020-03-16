import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

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
  return ajaxRequest.get(`/api/v1/product/GetList`, options);
};

/**
 * 
批量切换产品的状态  删除| 置顶状态 |  上下架状态
 */

export const batchSwitchStatus = options => {
  return ajaxRequest.put(
    `/api/v1/product/BatchSwitchStatus/${options.switchType}/${options.flag}`,
    options.idList
  );
};
/**
 * 修改分类
 * @param {*} options
 */
export const batchChangeCategory = options => {
  return ajaxRequest.put(`/api/v1/product/BatchChangeCategory`, options);
};
/**
 * 新建产品
 * @param {*} options
 */
export const createProduct = options => {
  return ajaxRequest.post(`/api/v1/Product`, options);
};

/**
 *
 * @param {String} id 当前产品的id
 */

export const update = (id, options) => {
  return ajaxRequest.put(`/api/v1/Product/Update/${id}`, options);
};

/**
 * 获取产品详情
 * @param {*} options
 */
export const getProductDetail = id => {
  return ajaxRequest.get(`/api/v1/Product/${id}`);
};

/**
 * 复制产品
 * @param {*} options
 */
export const copyBatchProduct = options => {
  return ajaxRequest.post(`/api/v1/Product/BatchCopy`, options);
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
 * @name 产品单篇翻译
 * @param {*} options 翻译id 目标语言  站点id
 */
export const translateSignalProduct = options => {
  return ajaxRequest.post(`/api/v1/Product/Translate`, options);
};

/**
 *
 * @name 产品批量翻译
 * @param {*} options 翻译id 目标语言  站点id
 */
export const translateMoreProduct = options => {
  return ajaxRequest.post(`/api/v1/Product/MultilingualTranslate`, options);
};

/**
 *
 * @name 获取产品翻译进度
 * @param {*} translateId 翻译id
 */
export const getProductTranslateProcess = translateId => {
  return ajaxRequest.get(`api/v1/product/GetTranslateProgress/${translateId}`);
};

/**
 * @name 是否已经存在文章翻译
 */
export const isHasTranslateProcess = () => {
  return ajaxRequest.get(`/api/v1/product/IsExistTranslateProcess`);
};

/**
 *
 * @name 获取产品是否翻译过
 * @param {*} id 产品id
 */
export const productTranslateStatus = id => {
  return ajaxRequest.get(`/api/v1/Product/GetTranslatedList/${id}`);
};

/**
 * @name 翻译前检查状态
 * @param {*} id 文章的id
 */
export const checkAutoTranslateStatus = id => {
  return ajaxRequest.get(`/api/v1/Product/TranslatePreCheck/${id}`);
};

/**
 * @name 获取自动翻译/覆盖翻译是否开启的状态
 */
export const getAutoTranslateStatus = () => {
  return ajaxRequest.get(`/api/v1/Product/GetAutoTranslateConfig`);
};

/**
 * @name 切换自动翻译状态
 */
export const switchAutoTranslateStatus = () => {
  return ajaxRequest.put(`/api/v1/Product/SwitchAutoTranslateStatus`);
};

/**
 * @name 切换弹窗开启/关闭状态
 */
export const switchTipsModalStatus = () => {
  return ajaxRequest.put(`/api/v1/Product/SwitchTipsStatus`);
};

/**
 * @name 切换覆盖翻译配置
 */
export const switchCoverTranslateConfig = () => {
  return ajaxRequest.get(`/api/v1/News/SwitchOverwriteStatus`);
};

/**
 * @name 自动翻译
 * @param {*} options 翻译参数 - id：翻译文章id - overwrite：是否覆盖翻译
 */
export const autoTranslate = options => {
  if (options.type === 1) {
    return ajaxRequest.put(
      `/api/v1/Product/AutoTranslate/${options.id}?overwrite=true`
    );
  }
  if (options.type === 2) {
    return ajaxRequest.put(
      `/api/v1/Product/AutoTranslate/${options.id}?overwrite=false`
    );
  }
  if (options.type === 3) {
    return ajaxRequest.put(`/api/v1/Product/AutoTranslate/${options.id}`);
  }
};
