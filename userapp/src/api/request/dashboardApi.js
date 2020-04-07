import environment from "@/environment/index";

import * as ajaxRequest from "../ajaxRequest";

// 获取阿里云免登信息
export const getAliyunSsoLoginInfo = para => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/ssologin/GetAliyunSsoLoginInfo`,
    para
  );
};
// 首次免登用户发送验证码
export const sendAliyunMobileVerifyCode = phone => {
  return ajaxRequest.put(
    `${environment.memberManageApi}/api/v1/phone/SendAliyunMobileVerifyCode/${phone}`
  );
};
// 首次免登用户发送验证码
export const createAliyunSsoLoginUser = para => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/ssologin/CreateAliyunSsoLoginUser`,
    para
  );
};
// 切换自动翻译状态
export const switchAutoTranslateStatus = () => {
  return ajaxRequest.put(
    `${environment.designerManageApi}/api/v1/Page/SwitchAutoTranslateStatus`
  );
};
// 获取自动翻译状态
export const getAutoTranslateConfig = () => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/Page/GetAutoTranslateConfig`
  );
};
// 获取中文站点的信息
export const getChineseSiteInfo = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/siteInfo/GetChineseSiteInfo`
  );
};
// 整站翻译
export const translate = para => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/siteInfo/Translate`,
    para
  );
};
// 获取翻译进度
export const getTranslateProgress = translateId => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/siteInfo/GetTranslateProgress/${translateId}`
  );
};
// 获取dashboard站点信息
export const getTodoInfo = siteId => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/Dashboard/GetTodoInfo/${siteId}`
  );
};
// 获取dashboard内容数量
export const getContentInfo = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/Dashboard/GetContentInfo`
  );
};
// 判断是否是管理员
export const amIAdmin = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/Dashboard/AmIAdmin`
  );
};
/**
 * 更改appName
 */
export const updateAppName = para => {
  return ajaxRequest.put(
    `${environment.memberManageApi}/api/v1/appInfo/UpdateAppName`,
    para
  );
};
/**
 * 获取当前siteId
 */
export const getCurSiteId = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/userInfo/GetCurrentSiteId`
  );
};
/**
 * 更改siteName
 */
export const updateSiteName = (siteId, siteName) => {
  let para = { siteId: siteId, siteName: siteName };
  console.log(siteId, para);
  return ajaxRequest.put(
    `${environment.designerManageApi}/api/v1/siteInfo/UpdateSiteName`,
    para
  );
};
/**
 * 更改站点语言
 */
export const updateSiteLanguage = (siteId, language) => {
  let para = { siteId: siteId, language: language };
  return ajaxRequest.put(
    `${environment.designerManageApi}/api/v1/siteInfo/UpdateSiteLanguage`,
    para
  );
};
/**
 * 更改站点语言
 */
export const updateSiteInfo = para => {
  return ajaxRequest.put(
    `${environment.designerManageApi}/api/v1/siteInfo/UpdateSiteInfo`,
    para
  );
};
/**
 * 获取site列表
 */
export const getSites = () => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/siteInfo/GetSites`
  );
};
/**
 * 获取app信息
 */
export const getApplication = () => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/appInfo/GetApplication`
  );
};

/**
 * 获取设计秘籍列表，版本更新列表，应用推荐列表
 */
export const getAppExpandInfo = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/appInfo/GetAppExpandInfo`
  );
};

/**
 * 获取app列表
 */
export const getApplicationsByUserId = appName => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/appInfo/GetApplicationsByUserId`,
    { appName: appName }
  );
};
/**
 * 切换app记录appId
 */
export const updateUserLastAppIdAndCookie = appId => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/userInfo/UpdateUserLastAppIdAndCookie/${appId}`
  );
};
/**
 * 切换site记录siteId
 */
export const updateUserLastSiteId = siteId => {
  return ajaxRequest.put(
    `${environment.memberManageApi}/api/v1/userInfo/UpdateUserLastSiteId`,
    siteId
  );
};

/**
 * 获取用户头像
 */
export const getAppHeadInfo = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/appInfo/GetAppHeadInfo`
  );
};

/**
 *desc:获取第一行业
 * author:xuzhuan
 * time:2019.08.05
 **/
export const GetFirstIndustries = () => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/siteInfo/GetFirstIndustries`
  );
};

/**
 *desc:获取第一行业
 * author:xuzhuan
 * time:2019.08.05
 **/
export const GetSecondIndustries = parentId => {
  let para = { firstIndustryId: parentId };
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/siteInfo/GetSecondIndustries`,
    para
  );
};
/**
 * 修改网站类型和所属行业
 */
export const updateSiteType = para => {
  return ajaxRequest.put(
    `${environment.designerManageApi}/api/v1/siteInfo/UpdateSiteType`,
    para
  );
};
export const updateSiteIndustry = para => {
  return ajaxRequest.put(
    `${environment.designerManageApi}/api/v1/siteInfo/UpdateSiteIndustry`,
    para
  );
};
/**
 *desc:创建站点
 * author:xuzhuan
 * time:2019.08.08
 **/
export const createSite = siteName => {
  let para = { siteName: siteName };
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/siteInfo/CreateSite`,
    para
  );
};
// 复制当前站点
export const copySite = para => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/siteInfo/CopySite`,
    para
  );
};

//  获取pv uv
export const getPvUvIp = appId => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/DomainManage/GetPvUvIp/${appId}`
  );
};

/**
 * 获取签名列表
 */
export const getAkSk = () => {
  return ajaxRequest.get(`${environment.memberManageApi}/api/v1/AkSk/get`);
};
/**
 * 获取模版列表
 */
export const getCustomTemplateList = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/Sms/GetCustomTemplateList`
  );
};
/**
 * 获取签名列表
 */
export const getSiteSMSSignList = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/Sms/GetSMSSignList`
  );
};
/**
 * 删除模版
 */
export const removeCustomTemplate = tempId => {
  return ajaxRequest._delete(
    `${environment.memberManageApi}/api/v1/Sms/RemoveCustomTemplate/${tempId}`
  );
};
/**
 * 删除短信签名
 */
export const deleteSiteSMSSignById = id => {
  return ajaxRequest._delete(
    `${environment.memberManageApi}/api/v1/sms/DeleteSMSSignById?id=${id}`
  );
};

//创建签名 post
export const createSiteSMSSign = signName => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/Sms/CreateSMSSign`,
    {
      signName: signName
    }
  );
};

//查询模板详情
export const getTemplateDetail = templateCode => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/Sms/GetTemplateDetail`,
    {
      templateCode: templateCode
    }
  );
};

//保存模板
export const addCustomTemplate = tempCode => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/Sms/AddCustomTemplate`,
    {
      tempCode: tempCode
    }
  );
};

//设置优先使用免费短信
export const setIsPreUseFreeSMS = (siteId, isPreUseFreeSMS) => {
  return ajaxRequest.put(
    `${environment.designerManageApi}/api/v1/SiteInfo/SetIsPreUseFreeSMS`,
    {
      siteId: siteId,
      isPreUseFreeSMS: isPreUseFreeSMS
    }
  );
};

//获取短信优先级状态
export const getIsPreUseFreeSMS = siteId => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/SiteInfo/GetIsPreUseFreeSMS`,
    {
      siteId: siteId
    }
  );
};
//获取免费短信条数
export const getSurplusFreeSMSCount = () => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/SMS/GetSurplusFreeSMSCount`
  );
};

//获取短信列表
export const getSmsList = (siteId, isSystem) => {
  return ajaxRequest.get(
    `${environment.memberManageApi}/api/v1/Sms/GetSmsList`,
    {
      siteId: siteId,
      isSystem: isSystem
    }
  );
};
//新增短信
export const addCustomSms = data => {
  return ajaxRequest.post(
    `${environment.memberManageApi}/api/v1/Sms/AddCustomSms`,
    data
  );
};
//修改短信
export const updateCustomSms = data => {
  return ajaxRequest.put(
    `${environment.memberManageApi}/api/v1/Sms/UpdateCustomSms`,
    data
  );
};

export const viewUmengData = () => {
  return ajaxRequest.get(
    `${environment.designerManageApi}/api/v1/domainmanage/jump2umeng`
  );
};
