
/**
 * 开发环境的URL
 */
let memberManageApi = 'http://192.168.199.99:8100';
let authorityUrl = "http://localhost:8000";//"http://192.168.199.99:8000";
let redirectUrl = "http://192.168.199.101:8082/callback";
let logoutRedirectUri = "http://192.168.199.101:8082/index.html";
let xuzhuanUrl = "http://localhost:8100/"
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
    xuzhuanUrl
};
export default enbironmemy;