import Oidc from 'oidc-client';
import enbironmemy from "@/environment/index";
console.log(enbironmemy)
const config = {
  authority: enbironmemy.authorityUrl,
  client_id: "dashboard.api",
  //client_id: "content.api",
  redirect_uri: enbironmemy.redirectUrl,
  response_type: 'code',
  // content.api
  //scope: 'openid profile content.api',
  scope: 'openid profile dashboard.api',
  post_logout_redirect_uri: enbironmemy.logoutRedirectUri,
};
const mgr = new Oidc.UserManager(config);
export default mgr;
