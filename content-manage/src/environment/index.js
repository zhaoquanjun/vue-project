/**
 *系统配置管理
 *
 */


/**生产环境 */
let memberManageApi = 'http://api.content.newwezhan.cn';
let uploadPicUrl = 'http://api.content.newwezhan.cn/api/picture';
let authorityUrl = "http://api.identity.newwezhan.cn";
let redirectUrl = "http://content.newwezhan.cn/callback";
let logoutRedirectUri = "http://content.newwezhan.cn/index.html";
let silentRedirectUri = 'http://content.newwezhan.cn/static/silent-renew.html';
let clientId = 'content.api';
/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    memberManageApi = 'http://api.content.newwezhan.cn';
    uploadPicUrl = 'http://api.content.newwezhan.cn/api/picture';
    authorityUrl = "http://api.identity.newwezhan.cn";
    redirectUrl = "http://localhost:8081/callback";
    logoutRedirectUri = "http://content.newwezhan.cn/index.html";
    silentRedirectUri = 'http://localhost:8081/static/silent-renew.html';
    clientId = 'dev.content.api';
};
const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    memberManageApi,
    uploadPicUrl,
    silentRedirectUri,
    clientId
};
export default enbironmemy;