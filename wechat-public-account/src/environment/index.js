/**
 *系统配置管理
 *
 */
const baseServerUrl = window.location.hostname=='clouddream.net'?'clouddream.net':'wezhan.cn';
const httpSchema = window.location.hostname=='clouddream.net'?'https://':'http://';

/**生产环境-- */
let contentApi = `${httpSchema}api.content.${baseServerUrl}`;
let contentApiUri = `${httpSchema}api.content.${baseServerUrl}`;
let dashboardApi = `${httpSchema}api.dashboard.${baseServerUrl}`;
let uploadPicUrl = `${httpSchema}api.content.${baseServerUrl}/api/v1/picture`;
let authorityUrl = `${httpSchema}login.${baseServerUrl}`;
let redirectUrls = `${httpSchema}wechataccount.${baseServerUrl}/callback`;
let logoutRedirectUri = `${httpSchema}wechataccount.${baseServerUrl}/index.html`;
let silentRedirectUri = `${httpSchema}wechataccount.${baseServerUrl}/static/silent-renew.html`;
let clientId = 'weixinopen.api';
let scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api ";
let pageApi = `${httpSchema}api.designer.${baseServerUrl}`;
let pageApiUri = `${httpSchema}api.designer.${baseServerUrl}`;
let newsApi = `${httpSchema}api.content.${baseServerUrl}`;
let imageApi = `${httpSchema}api.content.${baseServerUrl}`;
let wechataccountApi = `${httpSchema}open.weixin.${baseServerUrl}`;
export let siteDomain = `content.${baseServerUrl}`;
export let wechataccountDomain = `wechataccount.${baseServerUrl}`
// 个人中心
export let personalUrl = `${httpSchema}dashboard.${baseServerUrl}/personal`;
export let dashboardUrl = `${httpSchema}dashboard.${baseServerUrl}/board`;
// 阿里云续费地址
export let aliMarketUrl = "https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0";

let redirectUrl = {
    createArticle: `${httpSchema}content.${baseServerUrl}/content/createarticle`,
    createProduct: `${httpSchema}content.${baseServerUrl}/content/createproduct`,
    uploadFile: `${httpSchema}content.${baseServerUrl}/content/file`,
    siteDomain: `${httpSchema}dashboard.${baseServerUrl}/website/sitedomain`,
    addPicture: `${httpSchema}content.${baseServerUrl}/content/picture`
};
/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    contentApi = 'http://api.content.wezhan.cn';
    contentApiUri = 'http://api.content.wezhan.cn';
    dashboardApi = 'http://api.dashboard.wezhan.cn';
    uploadPicUrl = 'http://api.content.wezhan.cn/api/v1/picture';
    authorityUrl = "http://login.wezhan.cn";
    redirectUrls = "http://localhost:8084/callback";
    logoutRedirectUri = "http://localhost:8084/index.html";
    silentRedirectUri = 'http://localhost:8084/static/silent-renew.html';
    clientId = 'dev.weixinopen.api';
    scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api";
    wechataccountApi = "http://open.weixin.wezhan.cn"
    pageApi = 'http://api.designer.wezhan.cn';
    pageApiUri = 'http://api.designer.wezhan.cn';
    newsApi = 'http://api.content.wezhan.cn';
    imageApi = 'http://api.content.wezhan.cn';
    redirectUrl['createArticle'] = 'http://content.wezhan.cn/content/createarticle';
    redirectUrl['createProduct'] = 'http://content.wezhan.cn/content/createproduct';
    redirectUrl['uploadFile'] = 'http://content.wezhan.cn/content/file';
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