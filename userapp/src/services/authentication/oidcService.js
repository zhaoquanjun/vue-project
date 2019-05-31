import Oidc from 'oidc-client';
import enbironmemy from "@/environment/index";
console.log(enbironmemy)
const config = {
  authority: enbironmemy.authorityUrl,
  client_id: "js",
  redirect_uri: enbironmemy.redirectUrl,
  response_type: 'code',
  scope: 'openid profile content.api',
  post_logout_redirect_uri: enbironmemy.logoutRedirectUri,
};
const mgr = new Oidc.UserManager(config);
export default mgr;
