
/**
 * 开发环境的URL
 */
const httpSchema = "https://";
let siteManageApi =`${httpSchema}api.designer.console.clouddream.net`;
let memberManageApi = `${httpSchema}api.dashboard.console.clouddream.net`;
let uploadPicUrl = `${httpSchema}api.content.console.clouddream.net/api/picture`;
let uploadRobotsUrl = `${httpSchema}api.designer.console.clouddream.net/api/v1/Robots/AddOrOverride/`;
let uploadSitemapUrl = `${httpSchema}api.designer.console.clouddream.net/api/v1/SiteMapFile/AddOrOverride/`;


let authorityUrl = `${httpSchema}login.console.clouddream.net`;
let redirectUrl = `${httpSchema}dashboard.console.clouddream.net/callback`
let logoutRedirectUri = `${httpSchema}dashboard.console.clouddream.net/index.html`;
let silentRedirectUri = `${httpSchema}dashboard.console.clouddream.net/static/silent-renew.html`;
let clientId = `dashboard.api`;
let scope = `openid profile dashboard.api content.api designer.api produce.api weixinopen.api`;


export let designerManageApi = `${httpSchema}api.designer.console.clouddream.net`;
export let siteDomain = `dashboard.console.clouddream.net`
export let shiftToAliyun = `https://help.aliyun.com/document_detail/54077.html?spm=a2c4g.11186623.2.10.61ca4c07hLv73n`;
export let whyOpenCdn = `https://help.aliyun.com/document_detail/27101.html`;
export let articleManageUrl = `${httpSchema}content.console.clouddream.net/content/news`;
export let productManageUrl = `${httpSchema}content.console.clouddream.net/content/product`;
export let imgManageUrl = `${httpSchema}content.console.clouddream.net/content/picture`;
export let fileManageUrl = `${httpSchema}content.console.clouddream.net/content/file`;
export let designerUrl = `${httpSchema}designer.console.clouddream.net`;
export let mySiteUrl = `${httpSchema}dashboard.console.clouddream.net/website/mysite`;
export let dashboardUrl = `${httpSchema}dashboard.console.clouddream.net/board`;
// 阿里云续费地址
export let aliMarketUrl = "https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0";
// 预览网站地图文件地址
export let previewSitemapUrl = "http://api.designer.console.clouddream.net/api/v1/SiteMap/Preview/";

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