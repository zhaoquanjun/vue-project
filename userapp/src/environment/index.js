
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
    redirectUrl = "http://localhost:8082/callback";
<<<<<<< HEAD
    logoutRedirectUri = "http://www.newwezhan.cn/index.html";
=======
    logoutRedirectUri = "http://dashboard.newwezhan.cn/index.html";
>>>>>>> 5a1e5905bee62bf8b6b6a47149c5a7b03f45d33c
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