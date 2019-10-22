/**
 *系统配置管理
 *
 */


/**生产环境-- */
let contentApi = 'https://api.content.console.clouddream.net';
let contentApiUri = 'https://api.content.console.clouddream.net';
let dashboardApi = 'https://api.dashboard.console.clouddream.net';
let uploadPicUrl = 'https://api.content.console.clouddream.net/api/picture';
let authorityUrl = "https://login.console.clouddream.net";
let redirectUrls = "https://wechataccount.console.clouddream.net/callback";
let logoutRedirectUri = "https://wechataccount.console.clouddream.net/index.html";
let silentRedirectUri = 'https://wechataccount.console.clouddream.net/static/silent-renew.html';
let clientId = 'weixinopen.api';
let scope = "openid profile dashboard.api content.api designer.api produce.api weixinopen.api ";
let pageApi = 'https://api.designer.console.clouddream.net';
let pageApiUri = 'https://api.designer.console.clouddream.net';
let newsApi = 'https://api.content.console.clouddream.net';
let imageApi = 'https://api.content.console.clouddream.net';
let wechataccountApi = "https://open.weixin.console.clouddream.net";
export let siteDomain = "content.console.clouddream.net";
export let wechataccountDomain = "wechataccount.console.clouddream.net"
// 个人中心
export let personalUrl = "https://dashboard.console.clouddream.net/personal";
export let dashboardUrl = "https://dashboard.console.clouddream.net/board";
// 阿里云续费地址
export let aliMarketUrl = "https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0";

let redirectUrl = {
    createArticle: 'https://content.console.clouddream.net/content/createarticle',
    createProduct: 'https://content.console.clouddream.net/content/createproduct',
    uploadFile: 'https://content.console.clouddream.net/content/file'
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