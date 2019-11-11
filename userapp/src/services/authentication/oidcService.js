Array.from = Array.from || function (r) {
    [].slice.call(r);
  }; 
  
import Oidc from 'oidc-client';
import enbironmemy from "@/environment/index";
const config = {
    authority: enbironmemy.authorityUrl,
    client_id: enbironmemy.clientId,
    redirect_uri: enbironmemy.redirectUrl,
    response_type: 'code',
    userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
    scope: enbironmemy.scope,
    post_logout_redirect_uri: enbironmemy.logoutRedirectUri,
    automaticSilentRenew: true,
    silent_redirect_uri: enbironmemy.silentRedirectUri,
    accessTokenExpiringNotificationTime: 10,
};
const mgr = new Oidc.UserManager(config);
export default mgr;
