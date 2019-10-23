/**
 *系统配置管理
 *
 */
const baseServerUrl = window.location.hostname=='clouddream.net'?'clouddream.net':'wezhan.cn';
const httpSchema = window.location.hostname=='clouddream.net'?'https://':'http://';

/**生产环境-- */
let contentApi = `${httpSchema}api.content.console.${baseServerUrl}`;
let contentApiUri = `${httpSchema}api.content.console.${baseServerUrl}`;
let dashboardApi = `${httpSchema}api.dashboard.console.${baseServerUrl}`;
let uploadPicUrl = `${httpSchema}api.content.console.${baseServerUrl}/api/picture`;
let authorityUrl = `${httpSchema}login.console.${baseServerUrl}`;
let redirectUrls = `${httpSchema}wechataccount.console.${baseServerUrl}/callback`;
let logoutRedirectUri = `${httpSchema}wechataccount.console.${baseServerUrl}/index.html`;
let silentRedirectUri = `${httpSchema}wechataccount.console.${baseServerUrl}/static/silent-renew.html`;
let clientId = 'weixinopen.api';
let scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api ";
let pageApi = `${httpSchema}api.designer.console.${baseServerUrl}`;
let pageApiUri = `${httpSchema}api.designer.console.${baseServerUrl}`;
let newsApi = `${httpSchema}api.content.console.${baseServerUrl}`;
let imageApi = `${httpSchema}api.content.console.${baseServerUrl}`;
let wechataccountApi = `${httpSchema}open.weixin.console.${baseServerUrl}`;
export let siteDomain = `content.console.${baseServerUrl}`;
export let wechataccountDomain = `wechataccount.console.${baseServerUrl}`
// 个人中心
export let personalUrl = `${httpSchema}dashboard.console.${baseServerUrl}/personal`;
export let dashboardUrl = `${httpSchema}dashboard.console.${baseServerUrl}/board`;
// 阿里云续费地址
export let aliMarketUrl = "https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0";

let redirectUrl = {
    createArticle: `${httpSchema}content.console.${baseServerUrl}/content/createarticle`,
    createProduct: `${httpSchema}content.console.${baseServerUrl}/content/createproduct`,
    uploadFile: `${httpSchema}content.console.${baseServerUrl}/content/file`,
    siteDomain: `${httpSchema}dashboard.console.${baseServerUrl}/website/sitedomain`,
    addPicture: `${httpSchema}content.console.${baseServerUrl}/content/picture`
};
/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    contentApi = 'http://api.content.console.wezhan.cn';
    contentApiUri = 'http://api.content.console.wezhan.cn';
    dashboardApi = 'http://api.dashboard.console.wezhan.cn';
    uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
    authorityUrl = "http://login.console.wezhan.cn";
    redirectUrls = "http://localhost:8084/callback";
    logoutRedirectUri = "http://localhost:8084/index.html";
    silentRedirectUri = 'http://localhost:8084/static/silent-renew.html';
    clientId = 'dev.weixinopen.api';
    scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api";
    wechataccountApi = "http://open.weixin.console.wezhan.cn"
    pageApi = 'http://api.designer.console.wezhan.cn';
    pageApiUri = 'http://api.designer.console.wezhan.cn';
    newsApi = 'http://api.content.console.wezhan.cn';
    imageApi = 'http://api.content.console.wezhan.cn';
    redirectUrl['createArticle'] = 'http://content.console.wezhan.cn/content/createarticle';
    redirectUrl['createProduct'] = 'http://content.console.wezhan.cn/content/createproduct';
    redirectUrl['uploadFile'] = 'http://content.console.wezhan.cn/content/file';
}

const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    contentApi,
    contentApiUri,
    dashboardApi,
    uploadPicUrl,
    silentRedirectUri,
    clientId,
    scope,
    wechataccountApi,
    pageApi,
    newsApi,
    pageApiUri,
    redirectUrls,
    imageApi
};
export default enbironmemy;