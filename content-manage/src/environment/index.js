
/**
 * 开发环境的URL
 */
let memberManageApi = 'http://localhost:8200';
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
  memberManageApi
};
export default enbironmemy;