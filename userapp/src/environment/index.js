
/**
 * 开发环境的URL
 */
let memberManageApi = 'http://api.dashboard.newwezhan.cn';
let authorityUrl = "http://api.identity.newwezhan.cn";
let redirectUrl = "http://localhost:8082/callback"; //"http://dashboard.newwezhan.cn/callback"
let logoutRedirectUri = "http://dashboard.newwezhan.cn/index.html";
let silentRedirectUri = 'http://localhost:8082/static/silent-renew.html';

if (process.env.NODE_ENV === 'development') {
    memberManageApi = 'http://api.dashboard.newwezhan.cn';
    authorityUrl = "http://api.identity.newwezhan.cn";
    redirectUrl = "http://localhost:8082/callback";
    logoutRedirectUri = "http://dashboard.newwezhan.cn/index.html";
    silentRedirectUri = 'http://localhost:8082/static/silent-renew.html';
}

/**
 * 环境的URL
 */


const enbironmemy = {
  authorityUrl,
  redirectUrl,
  logoutRedirectUri,
  memberManageApi,
  silentRedirectUri
};
export default enbironmemy;