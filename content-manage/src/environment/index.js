/**
 *系统配置管理
 *
 */
const baseServerUrl = window.location.hostname=='clouddream.net'?'clouddream.net':'wezhan.cn';
const httpSchema = window.location.hostname=='clouddream.net'?'https://':'http://';

/**生产环境-- */
let contentApi = `${httpSchema}api.content.console.${baseServerUrl}`;
let dashboardApi = `${httpSchema}api.dashboard.console.${baseServerUrl}`;
let uploadPicUrl = `${httpSchema}api.content.console.${baseServerUrl}/api/picture`;
let authorityUrl = `${httpSchema}login.console.${baseServerUrl}`;
let redirectUrl = `${httpSchema}content.console.${baseServerUrl}/callback`;
let logoutRedirectUri = `${httpSchema}content.console.${baseServerUrl}/index.html`;
let silentRedirectUri = `${httpSchema}content.console.${baseServerUrl}/static/silent-renew.html`;
let designerManageApi = `${httpSchema}api.designer.console.${baseServerUrl}`;
let clientId = 'content.api';
let scope = 'openid profile dashboard.api content.api designer.api produce.api weixinopen.api';
export let siteDomain = `content.console.${baseServerUrl}`;
// 个人中心
export let personalUrl = `${httpSchema}dashboard.console.${baseServerUrl}/personal`;
export let dashboardUrl = `${httpSchema}dashboard.console.${baseServerUrl}/board`;
// 阿里云续费地址
export let aliMarketUrl = 'https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0';
/**
 * 开发环境的URL
 */

console.log(process.env.NODE_ENV,'----')

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'location') {
    contentApi = `${httpSchema}api.content.console.wezhan.cn`;
    dashboardApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
    uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/picture`;
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