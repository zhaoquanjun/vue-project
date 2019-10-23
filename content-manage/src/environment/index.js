/**
 *系统配置管理
 *
 */
const baseServerUrl = window.location.hostname=='clouddream.net'?'clouddream.net':'console.wezhan.cn';
const httpSchema = window.location.hostname=='clouddream.net'?'https://':'http://';

/**生产环境-- */
let contentApi = `${httpSchema}api.content.${baseServerUrl}`;
let dashboardApi = `${httpSchema}api.dashboard.${baseServerUrl}`;
let uploadPicUrl = `${httpSchema}api.content.${baseServerUrl}/api/v1/picture`;
let authorityUrl = `${httpSchema}login.${baseServerUrl}`;
let redirectUrl = `${httpSchema}content.${baseServerUrl}/callback`;
let logoutRedirectUri = `${httpSchema}content.${baseServerUrl}/index.html`;
let silentRedirectUri = `${httpSchema}content.${baseServerUrl}/static/silent-renew.html`;
let designerManageApi = `${httpSchema}api.designer.${baseServerUrl}`;
let clientId = 'content.api';
let scope = 'openid profile dashboard.api content.api designer.api produce.api weixinopen.api';
export let siteDomain = `content.${baseServerUrl}`;
// 个人中心
export let personalUrl = `${httpSchema}dashboard.${baseServerUrl}/personal`;
export let dashboardUrl = `${httpSchema}dashboard.${baseServerUrl}/board`;
// 阿里云续费地址
export let aliMarketUrl = 'https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0';
/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    contentApi = `${httpSchema}api.content.console.wezhan.cn`;
    dashboardApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
    uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/v1/picture`;
    authorityUrl = `${httpSchema}login.console.wezhan.cn`;
    redirectUrl = `${httpSchema}localhost:8081/callback`;
    logoutRedirectUri = `${httpSchema}content.console.wezhan.cn/index.html`;
    silentRedirectUri = `${httpSchema}localhost:8081/static/silent-renew.html`;
    designerManageApi = `${httpSchema}api.designer.console.wezhan.cn`;
    clientId = 'dev.content.api';
    scope = 'openid profile dashboard.api content.api designer.api produce.api';
} 
const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    contentApi,
    dashboardApi,
    uploadPicUrl,
    silentRedirectUri,
    clientId,
    scope,
    designerManageApi
};
export default enbironmemy;