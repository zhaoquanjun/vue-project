import Vue from 'vue';
import VueRouter from 'vue-router';
import { defaultRoutes } from "./routes"
import store from "@/store/index";
import securityService from "@/services/authentication/securityService";
import {getLocal} from '@/libs/local'


Vue.use(VueRouter);
let router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: defaultRoutes
});
export default router;


let appId =  store.state.dashboard.appId;
let siteId =  store.state.dashboard.siteId;
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
  if (to.name !== "callback") {
    if (!to.meta.requiresAuth) {
      if (!appId) {
        await store.dispatch('_updateAppIdAndSiteIdToCookie')
      }
      store.dispatch('_getMenuListData')
      next()
      return
    }
      if (!appId) {
        await store.dispatch('_updateAppIdAndSiteIdToCookie')
        next()
      }
      if (!siteId) {
        await store.dispatch('_setSiteId')
        next()
      }
      if (!getLocal("authList")) {
        await store.dispatch('_getMenuListData')
      }
      let r = await store.dispatch('getCurRouteAuth', to.path);
      if (r) {
        if (store.getters.getMenuList.length < 1) {
          await store.dispatch('_getMenuListData')
        }
        if (!store.getters.wx_status.isAuth || !store.getters.wx_status.isCertification || !store.getters.wx_status.isResolveSuccess) {
          await store.dispatch('_getWxStatus')
          let wx_status = store.state.wxaccount.wx_status;
          if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
            next('/wechataccount/wxauther');
            return;
          }
        }
        next()
      } else {
        next('/404')
      }
    } 
  }else {
    if(to.path == "/callback" || to.path == "/401"){
      next()
    }else{
      securityService.signIn(to.path)
    }
  } 
});

     