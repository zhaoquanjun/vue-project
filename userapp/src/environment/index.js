
/**
 * 生产环境的URL
 */

let authorityUrl = "http://192.168.199.99:8000";
let redirectUrl = "http://192.168.199.101:8082/callback";
let logoutRedirectUri = "http://192.168.199.101:8082/index.html"

/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {

}
const enbironmemy = {
  authorityUrl,
  redirectUrl,
  logoutRedirectUri
};
export default enbironmemy;