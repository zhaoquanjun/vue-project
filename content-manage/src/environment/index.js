/**
 *系统配置管理
 *
 */


/**生产环境-- */

const httpSchema = `https://`;
let contentApi = `${httpSchema}api.content.console.clouddream.net`;
let dashboardApi = `${httpSchema}api.dashboard.console.clouddream.net`;
let uploadPicUrl = `${httpSchema}api.content.console.clouddream.net/api/picture`;
let authorityUrl = `${httpSchema}login.console.clouddream.net`;
let redirectUrl = `${httpSchema}content.console.clouddream.net/callback`;
let logoutRedirectUri = `${httpSchema}content.console.clouddream.net/index.html`;
let silentRedirectUri = `${httpSchema}content.console.clouddream.net/static/silent-renew.html`;
let designerManageApi = `${httpSchema}api.designer.console.clouddream.net`;
let clientId = 'content.api';
let scope = 'openid profile dashboard.api content.api designer.api produce.api weixinopen.api';
export let siteDomain = 'content.console.clouddream.net';
// 个人中心
export let personalUrl = '//dashboard.console.clouddream.net/personal';
export let dashboardUrl = `${httpSchema}dashboard.console.clouddream.net/board`;
// 阿里云续费地址
export let aliMarketUrl = 'https://market.console.aliyun.com/imageconsole/index.htm?#/?_k=dd45g0';
/**
 * 开发环境的URL
 */

if (process.env.NODE_ENV === 'development') {
    contentApi = `${httpSchema}api.content.console.wezhan.cn`;
    dashboardApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
    uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/picture`;
    authorityUrl = `${httpSchema}login.console.wezhan.cn`;
    redirectUrl = `${httpSchema}localhost:8081/callback`;
    logoutRedirectUri = `${httpSchema}content.console.wezhan.cn/index.html`;
    silentRedirectUri = `${httpSchema}localhost:8081/static/silent-renew.html`;
    designerManageApi = `${httpSchema}api.designer.console.wezhan.cn`;
    clientId = 'dev.content.api';
    scope = 'openid profile dashboard.api content.api designer.api produce.api';
} 
const enbironmemy = {
    authorityUrl,
    redirectUrl,
    logoutRedirectUri,
    contentApi,
    dashboardApi,
    uploadPicUrl,
    silentRedirectUri,
    clientId,
    scope,
    designerManageApi
};
export default enbironmemy;