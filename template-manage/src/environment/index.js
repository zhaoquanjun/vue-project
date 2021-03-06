﻿/**
 *系统配置管理
 *
 */
const baseServerUrl = window.location.hostname.indexOf('clouddream.net') == -1 ? 'console.wezhan.cn' : 'clouddream.net';
//const httpSchema = window.location.hostname.indexOf('clouddream.net') == -1 ? 'http://':'https://';
const httpSchema ='https://';//2020-3-23演示环境也改为了https

/**生产环境-- */
let designerManageApi = `${httpSchema}api.designer.${baseServerUrl}`;
let memberManageApi = `${httpSchema}api.content.${baseServerUrl}`;
let dashboardApi = `${httpSchema}api.dashboard.${baseServerUrl}`;
let templateApi = `${httpSchema}api.wezhanproduce.${baseServerUrl}`;
let uploadPicUrl = `${httpSchema}api.content.${baseServerUrl}/api/v1/picture`;
let uploadComposeUrl = `${httpSchema}api.content.${baseServerUrl}/api/v1/picture/UploadControlPic/compose`;
let uploadNormalUrl = `${httpSchema}api.content.${baseServerUrl}/api/v1/picture/UploadControlPic/normal`;
let uploadCategoryUrl = `${httpSchema}api.content.${baseServerUrl}/api/v1/picture/UploadControlPic/category`;
let authorityUrl = `${httpSchema}login.${baseServerUrl}`;
let redirectUrl = `${httpSchema}template.${baseServerUrl}/callback`;
let logoutRedirectUri = `${httpSchema}template.${baseServerUrl}/index.html`;
let silentRedirectUri = `${httpSchema}template.${baseServerUrl}/static/silent-renew.html`;
let clientId = `produce.api`;
let scope = `openid profile dashboard.api content.api designer.api produce.api weixinopen.api`;
export let siteDomain = `template.${baseServerUrl}`;
export let errorUrl = `${httpSchema}login.${baseServerUrl}/404`;
// 个人中心
export let personalUrl = `//dashboard.${baseServerUrl}/personal`;
export let dashboardUrl = `${httpSchema}dashboard.${baseServerUrl}/board`;
// 阿里云续费地址
export let aliMarketUrl = 'https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0';

/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === `development`) {
    designerManageApi = `${httpSchema}api.designer.${baseServerUrl}`;
    memberManageApi = `${httpSchema}api.content.console.wezhan.cn`;
    dashboardApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
    templateApi = `${httpSchema}api.wezhanproduce.console.wezhan.cn`
    uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/v1/picture`;
    uploadComposeUrl = `${httpSchema}api.content.console.wezhan.cn/api/v1/picture/UploadControlPic/compose`;
    uploadNormalUrl = `${httpSchema}api.content.console.wezhan.cn/api/v1/picture/UploadControlPic/normal`;
    uploadCategoryUrl = `${httpSchema}api.content.console.wezhan.cn/api/v1/picture/UploadControlPic/category`;
    authorityUrl = `${httpSchema}login.console.wezhan.cn`;
    redirectUrl = `http://localhost:8083/callback`;//本地是http
    logoutRedirectUri = `${httpSchema}localhost:8083/index.html`;http://
    silentRedirectUri = `${httpSchema}localhost:8083/static/silent-renew.html`;
    clientId = "dev.produce.api";
    scope = "openid profile dashboard.api content.api designer.api produce.api";
};
const enbironmemy = {
    designerManageApi,
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    memberManageApi,
    dashboardApi,
    templateApi,
    uploadPicUrl,
    uploadComposeUrl,
    uploadNormalUrl,
    uploadCategoryUrl,
    silentRedirectUri,
    clientId,
    scope,
    errorUrl
};
export default enbironmemy;