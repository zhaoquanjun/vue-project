
/**
 * 开发环境的URL
 */
let memberManageApi = 'http://192.168.199.154:9999';
let uploadPicUrl = 'http://192.168.199.154:9999/api/picture';
//let memberManageApi = 'http://localhost:8200';
//let uploadPicUrl = 'http://localhost:8200/api/picture';
let authorityUrl = "http://192.168.199.99:8000";
let redirectUrl = "http://192.168.199.101:8082/callback";
let logoutRedirectUri = "http://192.168.199.101:8082/index.html"
if (process.env.NODE_ENV === 'development') {

}


/**
 * 环境的URL
 */


const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    memberManageApi,
    uploadPicUrl
};
export default enbironmemy;