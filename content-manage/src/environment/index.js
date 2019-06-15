/**生产环境 */
let memberManageApi = "";
let uploadPicUrl = "";
let authorityUrl = "";
let redirectUrl = "";
let logoutRedirectUri = "";
/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    memberManageApi = 'http://192.168.199.154:9999';
    uploadPicUrl = 'http://192.168.199.154:9999/api/picture';
    authorityUrl = "http://192.168.199.99:8000";
    redirectUrl = "http://192.168.199.101:8082/callback";
    logoutRedirectUri = "http://192.168.199.101:8082/index.html"
}
const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    memberManageApi,
    uploadPicUrl
};
export default enbironmemy;