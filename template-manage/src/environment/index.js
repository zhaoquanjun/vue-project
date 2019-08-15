/**
 *系统配置管理
 *
 */


/**生产环境-- */
let memberManageApi = 'http://api.content.console.wezhan.cn';
let dashboardApi = 'http://api.dashboard.console.wezhan.cn';
let templateApi = "http://api.wezhanproduce.console.wezhan.cn";
let uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
let authorityUrl = "http://api.identity.console.wezhan.cn";
let redirectUrl = "http://content.console.wezhan.cn/callback";
let logoutRedirectUri = "http://content.console.wezhan.cn/index.html";
let silentRedirectUri = 'http://content.console.wezhan.cn/static/silent-renew.html';
let clientId = 'content.api';
let scope = 'openid profile dashboard.api content.api';
export let siteDomain = "content.console.wezhan.cn";
// 个人中心
export let personalUrl = "//dashboard.console.wezhan.cn/personal";
export let dashboardUrl = "http://dashboard.console.wezhan.cn/board";

/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    memberManageApi = 'http://api.content.console.wezhan.cn';
    dashboardApi = 'http://api.dashboard.console.wezhan.cn';
    templateApi = "http://api.wezhanproduce.console.wezhan.cn"
    uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
    authorityUrl = "http://api.identity.console.wezhan.cn";
    redirectUrl = "http://localhost:8081/callback";
    logoutRedirectUri = "http://content.console.wezhan.cn/index.html";
    silentRedirectUri = 'http://localhost:8081/static/silent-renew.html';
    clientId = 'dev.content.api';
    scope = 'openid profile dashboard.api content.api'
};
const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    memberManageApi,
    dashboardApi,
    templateApi,
    uploadPicUrl,
    silentRedirectUri,
    clientId,
    scope
};
export default enbironmemy;