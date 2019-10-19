/**
 *系统配置管理
 *
 */


/**生产环境-- */

const httpSchema = `http://`;
let memberManageApi = `${httpSchema}api.content.console.wezhan.cn`;
let dashboardApi = `${httpSchema}api.dashboard.console.wezhan.cn`;
let templateApi = `${httpSchema}api.wezhanproduce.console.wezhan.cn`;
let uploadPicUrl = `${httpSchema}api.content.console.wezhan.cn/api/picture`;
let authorityUrl = `${httpSchema}login.console.wezhan.cn`;
let redirectUrl = `${httpSchema}template.console.wezhan.cn/callback`;
let logoutRedirectUri = `${httpSchema}template.console.wezhan.cn/index.html`;
let silentRedirectUri = `${httpSchema}template.console.wezhan.cn/static/silent-renew.html`;
let clientId = `produce.api`;
let scope = `openid profile dashboard.api content.api designer.api produce.api weixinopen.api`;
export let siteDomain = `template.console.wezhan.cn`;
// 个人中心
export let personalUrl = '//dashboard.console.wezhan.cn/personal';
export let dashboardUrl = `${httpSchema}dashboard.console.wezhan.cn/board`;
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
export default enbironmemy;