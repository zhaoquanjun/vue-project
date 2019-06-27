import oidcMgr from '@/services/authentication/oidcService';

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
    oidcMgr.signoutRedirect().then(function(resp) {
      console.log('signed out', resp)
      localStorage.clear();
    }).catch(function(err) {
      console.log(err)
    })
  }


}
export default new SecurityService
