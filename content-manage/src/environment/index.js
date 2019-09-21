/**
 *系统配置管理
 *
 */


/**生产环境-- */
let contentApi = 'http://api.content.console.wezhan.cn';
let dashboardApi = 'http://api.dashboard.console.wezhan.cn';
let uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
let authorityUrl = "http://login.console.wezhan.cn";
let redirectUrl = "http://content.console.wezhan.cn/callback";
let logoutRedirectUri = "http://content.console.wezhan.cn/index.html";
let silentRedirectUri = 'http://content.console.wezhan.cn/static/silent-renew.html';
let designerManageApi = 'http://api.designer.console.wezhan.cn';
let clientId = 'content.api';
let scope = "openid profile dashboard.api content.api designer.api produce.api";
export let siteDomain = "content.console.wezhan.cn";
// 个人中心
export let personalUrl = "//dashboard.console.wezhan.cn/personal";
export let dashboardUrl = "http://dashboard.console.wezhan.cn/board";
// 阿里云续费地址
export let aliMarketUrl = "https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0";
/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    contentApi = 'http://api.content.console.wezhan.cn';
    dashboardApi = 'http://api.dashboard.console.wezhan.cn';
    uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
    authorityUrl = "http://login.console.wezhan.cn";
    redirectUrl = "http://localhost:8081/callback";
    logoutRedirectUri = "http://content.console.wezhan.cn/index.html";
    silentRedirectUri = 'http://localhost:8081/static/silent-renew.html';
    designerManageApi = 'http://api.designer.console.wezhan.cn';
    clientId = 'dev.content.api';
    scope = "openid profile dashboard.api content.api designer.api produce.api";
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