
/**
 * 开发环境的URL
 */
let memberManageApi = 'http://api.dashboard.newwezhan.cn';
let authorityUrl = "http://api.identity.newwezhan.cn";
let redirectUrl = "http://dashboard.newwezhan.cn/callback";
let logoutRedirectUri = "http://dashboard.newwezhan.cn/index.html";

if (process.env.NODE_ENV === 'development') {
    memberManageApi = 'http://api.dashboard.newwezhan.cn';
    authorityUrl = "http://api.identity.newwezhan.cn";
    redirectUrl = "http://dashboard.newwezhan.cn/callback";
    logoutRedirectUri = "http://dashboard.newwezhan.cn/index.html";
}

/**
 * 环境的URL
 */


const enbironmemy = {
  authorityUrl,
  redirectUrl,
  logoutRedirectUri,
  memberManageApi
};
export default enbironmemy;