
/**
 * 开发环境的URL
 */
let memberManageApi = 'http://api.dashboard.console.wezhan.cn';
let authorityUrl = "http://api.identity.console.wezhan.cn";
let redirectUrl = "http://dashboard.console.wezhan.cn/callback"
let logoutRedirectUri = "http://dashboard.console.wezhan.cn/index.html";
let silentRedirectUri = 'http://localhost:8082/static/silent-renew.html';
let clientId = 'dashboard.api';

if (process.env.NODE_ENV === 'development') {
    memberManageApi = 'http://api.dashboard.console.wezhan.cn';
    authorityUrl = "http://api.identity.console.wezhan.cn";
    redirectUrl = "http://localhost:8082/callback";
    logoutRedirectUri = "http://dashboard.console.wezhan.cn/index.html";
    silentRedirectUri = 'http://localhost:8082/static/silent-renew.html';
    clientId = 'dev.dashboard.api';
}


/**
 * 环境的URL
 */


const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    memberManageApi,
    silentRedirectUri,
    clientId

};
export default enbironmemy;