
/**
 * 开发环境的URL
 */
let siteManageApi  = 'http://api.designer.console.wezhan.cn';
let memberManageApi = 'http://api.dashboard.console.wezhan.cn';
let uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
let authorityUrl = "http://api.identity.console.wezhan.cn";
let redirectUrl = "http://dashboard.console.wezhan.cn/callback"
let logoutRedirectUri = "http://dashboard.console.wezhan.cn/index.html";
let silentRedirectUri = 'http://dashboard.console.wezhan.cn/static/silent-renew.html';
let clientId = 'dashboard.api';
let scope = "openid profile dashboard.api designer.api content.api";

if (process.env.NODE_ENV === 'development') {
    siteManageApi  = 'http://api.designer.console.wezhan.cn';
    memberManageApi = 'http://api.dashboard.console.wezhan.cn';
    uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
    authorityUrl = "http://api.identity.console.wezhan.cn";
    redirectUrl = "http://localhost:8082/callback";
    logoutRedirectUri = "http://dashboard.console.wezhan.cn/index.html";
    silentRedirectUri = 'http://localhost:8082/static/silent-renew.html';
    clientId = 'dev.dashboard.api';
    scope = "openid profile dashboard.api designer.api content.api";
}


/**
 * 环境的URL
 */


const enbironmemy = {
    authorityUrl,
    redirectUrl,
    uploadPicUrl,
    logoutRedirectUri,
    memberManageApi,
    siteManageApi,
    silentRedirectUri,
    clientId,
    scope

};
export default enbironmemy;