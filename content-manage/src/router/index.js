import Vue from 'vue';
import VueRouter from 'vue-router';
import {  defaultRoutes } from "./routes"
import { getLocal } from "@/libs/local"
import store from "@/store/index";
import securityService from "@/services/authentication/securityService";

Vue.use(VueRouter);
let router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: defaultRoutes
});
export default router;


let appId = store.state.dashboard.appId;

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;

  let user = await securityService.getUser();
  let accessToken;
  if (user) {
    accessToken = user.access_token
  }
  if (to.path == "/signout-callback-oidc") {
    return
  }
  if (accessToken) {
    if (to.path !== "/callback") {
   
      if (!to.meta.requiresAuth) {
        if (!appId) {
          await store.dispatch('_updateAppIdAndSiteIdToCookie')
        }
        store.dispatch('_getMenuListData')
        next()
        return
      }
      if (!appId) { await store.dispatch('_updateAppIdAndSiteIdToCookie') }
      if (!getLocal("authList")) await store.dispatch('_getMenuListData');
      let r = await store.dispatch('getCurRouteAuth', to.path);
      console.log(r)
      if (r) {
        if (store.getters.getMenuList.length < 1) await store.dispatch('_getMenuListData')
        next()
      } else {
        next('/404')
      }
    } else {
      next()
    
    }
  } else {
    if(to.path == "/callback" || to.path == "/401"){
      next()
    }else{
      securityService.signIn(to.path)
    }
  }

});

