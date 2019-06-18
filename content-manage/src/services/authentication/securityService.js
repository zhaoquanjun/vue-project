import oidcMgr from '@/services/authentication/oidcService';
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
    returnPath ? oidcMgr.signinRedirect({ state: returnPath })
      : oidcMgr.signinRedirect()
  }
  signOut() {
    globalAuthData.isAuthenticated = false
    globalAuthData.token = ''
    oidcMgr.signoutRedirect().then(function(resp) {
      console.log('signed out', resp)
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