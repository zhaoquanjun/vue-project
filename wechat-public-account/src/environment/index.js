/**
 *系统配置管理
 *
 */
const baseServerUrl = window.location.hostname.indexOf('clouddream.net') == -1 ? 'console.wezhan.cn':'clouddream.net';
const httpSchema = window.location.hostname.indexOf('clouddream.net') == -1 ? 'http://':'https://';

/**生产环境-- */
let contentApi = `${httpSchema}api.content.${baseServerUrl}`;
let contentApiUri = `${httpSchema}api.content.${baseServerUrl}`;
let dashboardApi = `${httpSchema}api.dashboard.${baseServerUrl}`;
let uploadPicUrl = `${httpSchema}api.content.${baseServerUrl}/api/v1/picture`;
let authorityUrl = `${httpSchema}login.${baseServerUrl}`;
let redirectUrls = `${httpSchema}wechat.${baseServerUrl}/callback`;
let logoutRedirectUri = `${httpSchema}wechat.${baseServerUrl}/index.html`;
let silentRedirectUri = `${httpSchema}wechat.${baseServerUrl}/static/silent-renew.html`;
let clientId = 'weixinopen.api';
let scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api ";
let pageApi = `${httpSchema}api.designer.${baseServerUrl}`;
let pageApiUri = `${httpSchema}api.designer.${baseServerUrl}`;
let newsApi = `${httpSchema}api.content.${baseServerUrl}`;
let imageApi = `${httpSchema}api.content.${baseServerUrl}`;
let wechatApi = window.location.hostname.indexOf('clouddream.net') == -1 ? `${httpSchema}open.weixin.${baseServerUrl}`:'api.wechat.clouddream.net';
export let siteDomain = `wechat.${baseServerUrl}`;
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
    contentApi = 'http://api.content.console.wezhan.cn';
    contentApiUri = 'http://api.content.console.wezhan.cn';
    dashboardApi = 'http://api.dashboard.console.wezhan.cn';
    uploadPicUrl = 'http://api.content.console.wezhan.cn/api/v1/picture';
    authorityUrl = "http://login.console.wezhan.cn";
    redirectUrls = "http://localhost:8084/callback";
    logoutRedirectUri = "http://localhost:8084/index.html";
    silentRedirectUri = 'http://localhost:8084/static/silent-renew.html';
    clientId = 'dev.weixinopen.api';
    scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api";
    wechatApi = "http://open.weixin.console.wezhan.cn"
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
    wechatApi,
    pageApi,
    newsApi,
    pageApiUri,
    redirectUrls,
    imageApi
};
export default enbironmemy;