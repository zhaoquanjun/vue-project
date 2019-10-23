import oidcMgr from '@/services/authentication/oidcService';
import {clearAllLocal } from "@/libs/local.js";
class SecurityService {
  async authenticate(returnPath) {
    const user = await this.getUser() // see if the user details are in local storage
    if (user) {
      this.isAuthenticated = true
      this.user = user
    } else {
      await this.signIn(returnPath)
    }
  }
  async getUser() {
    const user = await oidcMgr.getUser();
    return user
  }
  signIn(returnPath) {
    returnPath ? oidcMgr.signinRedirect({ state: returnPath })
      : oidcMgr.signinRedirect()
  }
  signOut() {
    clearAllLocal()
    oidcMgr.signoutRedirect().then(function(resp) {
      console.log('signed out', resp)
      clearAllLocal()
    }).catch(function(err) {
      console.log(err)
    })
  }


}
export default new SecurityService
