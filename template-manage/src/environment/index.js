/**
 *系统配置管理
 *
 */


/**生产环境-- */

const httpSchema = `https://`;
let memberManageApi = `${httpSchema}api.content.console.clouddream.net`;
let dashboardApi = `${httpSchema}api.dashboard.console.clouddream.net`;
let templateApi = `${httpSchema}api.wezhanproduce.console.clouddream.net`;
let uploadPicUrl = `${httpSchema}api.content.console.clouddream.net/api/picture`;
let authorityUrl = `${httpSchema}login.console.clouddream.net`;
let redirectUrl = `${httpSchema}template.console.clouddream.net/callback`;
let logoutRedirectUri = `${httpSchema}template.console.clouddream.net/index.html`;
let silentRedirectUri = `${httpSchema}template.console.clouddream.net/static/silent-renew.html`;
let clientId = `produce.api`;
let scope = `openid profile dashboard.api content.api designer.api produce.api weixinopen.api`;
export let siteDomain = `template.console.clouddream.net`;
// 个人中心
export let personalUrl = '//dashboard.console.clouddream.net/personal';
export let dashboardUrl = `${httpSchema}dashboard.console.clouddream.net/board`;
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