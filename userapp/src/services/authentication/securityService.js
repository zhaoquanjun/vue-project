import oidcMgr from '@/services/authentication/oidcService';
import {clearAllLocal } from "@/libs/local.js";
import { clearAllCookie } from "@/libs/cookie"
const globalAuthData = {
  isAuthenticated: false,
  token: ''
}

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
    if (user) {
      globalAuthData.isAuthenticated = true
      globalAuthData.token = user.access_token
    }
    return user
  }
  signIn(returnPath) {
    clearAllLocal();
    clearAllCookie();
    returnPath ? oidcMgr.signinRedirect({ state: returnPath })
      : oidcMgr.signinRedirect()
  }
  signOut(returnPath) {
    clearAllLocal();
    clearAllCookie();
    oidcMgr.signoutRedirect({ state: returnPath }).then(function(resp) {
      
    }).catch(function(err) {
      console.log(err)
    })
  }
  isAuthenticated() {
    return globalAuthData.isAuthenticated
  }
  getAccessToken() {
    let token = null
    if (globalAuthData.isAuthenticated) {
      token = 'Bearer ' + globalAuthData.token
    }
    return {
      Authorization: token
    }
  }
}
export default new SecurityService
