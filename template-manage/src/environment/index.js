/**
 *系统配置管理
 *
 */
const baseServerUrl = window.location.hostname=='clouddream.net'?'clouddream.net':'wezhan.cn';

/**生产环境-- */

const httpSchema = window.location.hostname=='clouddream.net'?'https://':'http://';
let memberManageApi = `${httpSchema}api.content.console.${baseServerUrl}`;
let dashboardApi = `${httpSchema}api.dashboard.console.${baseServerUrl}`;
let templateApi = `${httpSchema}api.wezhanproduce.console.${baseServerUrl}`;
let uploadPicUrl = `${httpSchema}api.content.console.${baseServerUrl}/api/picture`;
let authorityUrl = `${httpSchema}login.console.${baseServerUrl}`;
let redirectUrl = `${httpSchema}template.console.${baseServerUrl}/callback`;
let logoutRedirectUri = `${httpSchema}template.console.${baseServerUrl}/index.html`;
let silentRedirectUri = `${httpSchema}template.console.${baseServerUrl}/static/silent-renew.html`;
let clientId = `produce.api`;
let scope = `openid profile dashboard.api content.api designer.api produce.api weixinopen.api`;
export let siteDomain = `template.console.${baseServerUrl}`;
// 个人中心
export let personalUrl = `//dashboard.console.${baseServerUrl}/personal`;
export let dashboardUrl = `${httpSchema}dashboard.console.${baseServerUrl}/board`;
// 阿里云续费地址
export let aliMarketUrl = 'https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0';

/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === `development`) {
    memberManageApi = `${httpSchema}api.content.console.wezhan.cn`;
    dashboardApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
    templateApi = `${httpSchema}api.wezhanproduce.console.wezhan.cn`
    uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/picture`;
    authorityUrl = `${httpSchema}login.console.wezhan.cn`;
    redirectUrl = `${httpSchema}localhost:8083/callback`;
    logoutRedirectUri = `${httpSchema}localhost:8083/index.html`;
    silentRedirectUri = `${httpSchema}localhost:8083/static/silent-renew.html`;
    clientId = "dev.produce.api";
    scope = "openid profile dashboard.api content.api designer.api produce.api";
};
const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    memberManageApi,
    dashboardApi,
    templateApi,
    uploadPicUrl,
    silentRedirectUri,
    clientId,
    scope
};
console.log('logoutRedirectUri123456',logoutRedirectUri)
export default enbironmemy;