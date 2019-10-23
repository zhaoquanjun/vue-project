
const baseServerUrl = window.location.hostname=='clouddream.net'?'clouddream.net':'console.wezhan.cn';
const httpSchema = window.location.hostname=='clouddream.net'?'https://':'http://';

let siteManageApi =`${httpSchema}api.designer.${baseServerUrl}`;
let memberManageApi = `${httpSchema}api.dashboard.${baseServerUrl}`;
let uploadPicUrl = `${httpSchema}api.content.${baseServerUrl}/api/v1/picture`;
let uploadRobotsUrl = `${httpSchema}api.designer.${baseServerUrl}/api/v1/Robots/AddOrOverride/`;
let uploadSitemapUrl = `${httpSchema}api.designer.${baseServerUrl}/api/v1/SiteMapFile/AddOrOverride/`;


let authorityUrl = `${httpSchema}login.${baseServerUrl}`;
let redirectUrl = `${httpSchema}dashboard.${baseServerUrl}/callback`
let logoutRedirectUri = `${httpSchema}dashboard.${baseServerUrl}/index.html`;
let silentRedirectUri = `${httpSchema}dashboard.${baseServerUrl}/static/silent-renew.html`;
let clientId = `dashboard.api`;
let scope = `openid profile dashboard.api content.api designer.api produce.api weixinopen.api`;


export let designerManageApi = `${httpSchema}api.designer.${baseServerUrl}`;
export let siteDomain = `dashboard.${baseServerUrl}`
export let shiftToAliyun = `https://help.aliyun.com/document_detail/54077.html?spm=a2c4g.11186623.2.10.61ca4c07hLv73n`;
export let whyOpenCdn = `https://help.aliyun.com/document_detail/27101.html`;
export let articleManageUrl = `${httpSchema}content.${baseServerUrl}/content/news`;
export let productManageUrl = `${httpSchema}content.${baseServerUrl}/content/product`;
export let imgManageUrl = `${httpSchema}content.${baseServerUrl}/content/picture`;
export let fileManageUrl = `${httpSchema}content.${baseServerUrl}/content/file`;
export let designerUrl = `${httpSchema}designer.${baseServerUrl}`;
export let mySiteUrl = `${httpSchema}dashboard.${baseServerUrl}/website/mysite`;
export let dashboardUrl = `${httpSchema}dashboard.${baseServerUrl}/board`;

// 阿里云续费地址
export let aliMarketUrl = "https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0";
// 预览网站地图文件地址
export let previewSitemapUrl = `${httpSchema}api.designer.${baseServerUrl}/api/v1/SiteMap/Preview/`;
//  图片地址
export let picUrlHangZhou = 'https://wezhan.oss-cn-hangzhou.aliyuncs.com/'

if (process.env.NODE_ENV === `development`) {
    siteManageApi = `${httpSchema}api.designer.console.wezhan.cn`;
    memberManageApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
    designerManageApi = `${httpSchema}api.designer.console.wezhan.cn`;
    uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/v1/picture`;
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