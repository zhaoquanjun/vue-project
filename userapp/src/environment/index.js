
/**
 * 开发环境的URL
 */
const httpSchema = "http://";
let siteManageApi =`${httpSchema}api.designer.console.wezhan.cn`;
let memberManageApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
let uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/picture`;
let uploadRobotsUrl = `${httpSchema}api.designer.console.wezhan.cn/api/v1/Robots/AddOrOverride/`;
let uploadSitemapUrl = `${httpSchema}api.designer.console.wezhan.cn/api/v1/SiteMapFile/AddOrOverride/`;


let authorityUrl = `${httpSchema}login.console.wezhan.cn`;
let redirectUrl = `${httpSchema}dashboard.console.wezhan.cn/callback`
let logoutRedirectUri = `${httpSchema}dashboard.console.wezhan.cn/index.html`;
let silentRedirectUri = `${httpSchema}dashboard.console.wezhan.cn/static/silent-renew.html`;
let clientId = `dashboard.api`;
let scope = `openid profile dashboard.api content.api designer.api produce.api`;


export let designerManageApi = `${httpSchema}api.designer.console.wezhan.cn`;
export let siteDomain = `dashboard.console.wezhan.cn`
export let shiftToAliyun = `https://help.aliyun.com/document_detail/54077.html?spm=a2c4g.11186623.2.10.61ca4c07hLv73n`;
export let whyOpenCdn = `https://help.aliyun.com/document_detail/27101.html`;
export let articleManageUrl = `${httpSchema}content.console.wezhan.cn/content/news`;
export let productManageUrl = `${httpSchema}content.console.wezhan.cn/content/product`;
export let imgManageUrl = `${httpSchema}content.console.wezhan.cn/content/picture`;
export let fileManageUrl = `${httpSchema}content.console.wezhan.cn/content/file`;
export let designerUrl = `${httpSchema}designer.console.wezhan.cn`;
export let mySiteUrl = `${httpSchema}dashboard.console.wezhan.cn/website/mysite`;
export let dashboardUrl = `${httpSchema}dashboard.console.wezhan.cn/board`;
// 阿里云续费地址
export let aliMarketUrl = "https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0";
// 预览网站地图文件地址
export let previewSitemapUrl = "http://api.designer.console.wezhan.cn/api/v1/SiteMap/Preview/";

if (process.env.NODE_ENV === `development`) {
    siteManageApi = `${httpSchema}api.designer.console.wezhan.cn`;
    memberManageApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
    designerManageApi = `${httpSchema}api.designer.console.wezhan.cn`;
    uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/picture`;
    uploadRobotsUrl = `${httpSchema}api.designer.console.wezhan.cn/api/v1/Robots/AddOrOverride/`;
    authorityUrl = `${httpSchema}login.console.wezhan.cn`;
    redirectUrl = `${httpSchema}localhost:8082/callback`;
    logoutRedirectUri = `${httpSchema}dashboard.console.wezhan.cn/index.html`;
    silentRedirectUri = `${httpSchema}localhost:8082/static/silent-renew.html`;
    clientId = "dev.dashboard.api";
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