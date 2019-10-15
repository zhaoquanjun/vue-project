
/**
 * 开发环境的URL
 */
let siteManageApi = 'http://api.designer.console.wezhan.cn';
let memberManageApi = 'http://api.dashboard.console.wezhan.cn';
let uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
let uploadRobotsUrl = "http://api.designer.console.wezhan.cn/api/v1/Robots/AddOrOverride/";
let uploadSitemapUrl = "http://api.designer.console.wezhan.cn/api/v1/SiteMapFile/AddOrOverride/";
let authorityUrl = "http://login.console.wezhan.cn";
let redirectUrl = "http://dashboard.console.wezhan.cn/callback"
let logoutRedirectUri = "http://dashboard.console.wezhan.cn/index.html";
let silentRedirectUri = 'http://dashboard.console.wezhan.cn/static/silent-renew.html';
let clientId = 'dashboard.api';
let scope = "openid profile dashboard.api content.api designer.api produce.api";
export let designerManageApi = 'http://api.designer.console.wezhan.cn';
export let siteDomain = "dashboard.console.wezhan.cn"
export let shiftToAliyun = "https://help.aliyun.com/document_detail/54077.html?spm=a2c4g.11186623.2.10.61ca4c07hLv73n";
export let whyOpenCdn = "https://help.aliyun.com/document_detail/27101.html";
export let articleManageUrl = "http://content.console.wezhan.cn/content/news";
export let productManageUrl = "http://content.console.wezhan.cn/content/product";
export let imgManageUrl = "http://content.console.wezhan.cn/content/picture";
export let fileManageUrl = "http://content.console.wezhan.cn/content/file";
export let designerUrl = "http://designer.console.wezhan.cn";
export let mySiteUrl = "http://dashboard.console.wezhan.cn/website/mysite";
export let dashboardUrl = "http://dashboard.console.wezhan.cn/board";
// 阿里云续费地址
export let aliMarketUrl = "https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0";
// 预览网站地图文件地址
export let previewSitemapUrl = "http://api.designer.console.wezhan.cn/api/v1/SiteMap/Preview/";

if (process.env.NODE_ENV === 'development') {
    siteManageApi = 'http://api.designer.console.wezhan.cn';
    memberManageApi = 'http://api.dashboard.console.wezhan.cn';
    designerManageApi = 'http://api.designer.console.wezhan.cn';
    uploadPicUrl = 'http://api.content.console.wezhan.cn/api/picture';
    uploadRobotsUrl = "http://api.designer.console.wezhan.cn/api/v1/Robots/AddOrOverride/";
    authorityUrl = "http://login.console.wezhan.cn";
    redirectUrl = "http://localhost:8082/callback";
    logoutRedirectUri = "http://dashboard.console.wezhan.cn/index.html";
    silentRedirectUri = 'http://localhost:8082/static/silent-renew.html';
    clientId = 'dev.dashboard.api';
    scope = "openid profile dashboard.api content.api designer.api produce.api";
}


/**
 * 环境的URL
 */


const enbironmemy = {
    authorityUrl,
    redirectUrl,
    uploadPicUrl,
    uploadRobotsUrl,
    uploadSitemapUrl,
    logoutRedirectUri,
    memberManageApi,
    siteManageApi,
    designerManageApi,
    silentRedirectUri,
    clientId,
    scope

};
export default enbironmemy;