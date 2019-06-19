import Oidc from 'oidc-client';
import enbironmemy from "@/environment/index";
const config = {
  authority: enbironmemy.authorityUrl,
  client_id: "dev.content.api",
  //client_id: "content.api",
  redirect_uri: enbironmemy.redirectUrl,
  response_type: 'code',
  // content.api
  //scope: 'openid profile content.api',
  scope: 'openid profile  content.api',
  post_logout_redirect_uri: enbironmemy.logoutRedirectUri,
  automaticSilentRenew: true,
  silent_redirect_uri: enbironmemy.silentRedirectUri,
  accessTokenExpiringNotificationTime: 10,
};
const mgr = new Oidc.UserManager(config);
console.log(mgr)
export default mgr;
