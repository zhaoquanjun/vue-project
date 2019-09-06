/**
 *系统配置管理
 *
 */


/**生产环境-- */
let memberManageApi = 'http://api.content.console.wezhan.cn';
let dashboardApi = 'http://api.dashboard.console.wezhan.cn';
let templateApi = "http://api.wezhanproduce.console.wezhan.cn";
let uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
let authorityUrl = "http://login.console.wezhan.cn";
let redirectUrl = "http://wezhanproduce.console.wezhan.cn/callback";
let logoutRedirectUri = "http://wezhanproduce.console.wezhan.cn/index.html";
let silentRedirectUri = 'http://wezhanproduce.console.wezhan.cn/static/silent-renew.html';
let clientId = 'produce.api';
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
    memberManageApi = 'http://api.content.console.wezhan.cn';
    dashboardApi = 'http://api.dashboard.console.wezhan.cn';
    templateApi = "http://api.wezhanproduce.console.wezhan.cn"
    uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
    authorityUrl = "http://login.console.wezhan.cn";
    redirectUrl = "http://localhost:8083/callback";
    logoutRedirectUri = "http://localhost:8083/index.html";
    silentRedirectUri = 'http://localhost:8083/static/silent-renew.html';
    clientId = 'dev.produce.api';
    scope = "openid profile dashboard.api content.api designer.api produce.api";
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