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
/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    memberManageApi = 'http://localhost:8200';
    uploadPicUrl = 'http://api.content.newwezhan.cn/api/picture';
    authorityUrl = "http://localhost:8000";
    redirectUrl = "http://localhost:8081/callback";
    logoutRedirectUri = "http://content.newwezhan.cn/index.html";
};
const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    memberManageApi,
    uploadPicUrl
};
export default enbironmemy;