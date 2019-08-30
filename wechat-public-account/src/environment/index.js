/**
 *系统配置管理
 *
 */


/**生产环境-- */
let contentApi = 'http://api.content.console.wezhan.cn';
let dashboardApi = 'http://api.dashboard.console.wezhan.cn';
let uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
let authorityUrl = "http://login.console.wezhan.cn";
let redirectUrl = "http://wechataccount.console.wezhan.cn/callback";
let logoutRedirectUri = "http://wechataccount.console.wezhan.cn/index.html";
let silentRedirectUri = 'http://wechataccount.console.wezhan.cn/static/silent-renew.html';
let clientId = 'weixinopen.api';
let scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api";
let wechataccountApi = "http://open.weixin.console.wezhan.cn"
export let siteDomain = "content.console.wezhan.cn";
export let wechataccountDomain="wechataccount.console.wezhan.cn"
// 个人中心
export let personalUrl = "//dashboard.console.wezhan.cn/personal";
export let dashboardUrl = "http://dashboard.console.wezhan.cn/board";

/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    contentApi = 'http://api.content.console.wezhan.cn';
    dashboardApi = 'http://api.dashboard.console.wezhan.cn';
    uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
    authorityUrl = "http://login.console.wezhan.cn";
    redirectUrl = "http://localhost:8084/callback";
    logoutRedirectUri = "http://localhost:8084/index.html";
    silentRedirectUri = 'http://localhost:8084/static/silent-renew.html';
    clientId = 'dev.weixinopen.api';
    scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api";
    wechataccountApi = "http://gonghd.imwork.net"
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
    wechataccountApi
};
export default enbironmemy;