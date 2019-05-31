import Oidc from 'oidc-client';

const config = {
  authority: "http://192.168.199.154:8001",
  client_id: "js",
  redirect_uri: "http://192.168.199.101:8082/callback",
  response_type: 'code',
  scope: 'openid profile content.api',
  post_logout_redirect_uri: "http://192.168.199.101:8082/index.html",
};
const mgr = new Oidc.UserManager(config);
// login()
// function login() {
//   mgr.signinRedirect();
// }
export default mgr;
