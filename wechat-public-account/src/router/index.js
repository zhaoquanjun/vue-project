import Vue from 'vue';
import VueRouter from 'vue-router';
import { defaultRoutes } from "./routes"
import store from "@/store/index";
import securityService from "@/services/authentication/securityService";
import { getLocal } from '@/libs/local'
import { getCookie } from "@/libs/cookie"
import environment from "@/environment/index";

Vue.use(VueRouter);
let router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: defaultRoutes
});
export default router;


let appId = store.state.dashboard.appId;
let siteId = getCookie("tjufje") || store.state.dashboard.siteId;
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  let user = await securityService.getUser();
  let accessToken;
  if (user) {
    accessToken = user.access_token;
  }

  if (accessToken) {
    if (to.name !== "callback") {
      if (store.getters.getMenuList.length < 1) {
        await store.dispatch('_getMenuListData')
      }
      let r = await store.dispatch('getCurRouteAuth', to.path);
      if (to.path.includes("/wechat")) {
        let haveTemplate = await store.dispatch('_haveTemplate');
        if (!haveTemplate) {
          window.location.href=environment.redirectUrl.selectTemplate;
          return
        }
      }
      if (!to.meta.requiresAuth) {
        next()
        return
      }
      // vtfsjogp => userinfo
      if (!getCookie("vtfsjogp")) {
        await store.dispatch("_getAppHeadInfo");
      }
      if (!appId) {
        await store.dispatch('_updateAppIdAndSiteIdToCookie')
      }
      if (!siteId) {
        await store.dispatch('_setSiteId')
      }
      
      if (r) {
        if (!store.getters.wx_status.isAuth || !store.getters.wx_status.isCertification || !store.getters.wx_status.isResolveSuccess) {
          await store.dispatch('_getWxStatus')
          let wx_status = store.state.wxaccount.wx_status || getLocal("wx_status");
          if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
            next('/wechat/wxauther');
            return;
          }
        }
        next()
      } else {
        window.location.href = environment.errorUrl
      }
    }
  } else {
    if (to.path == "/callback") {
      next()
    } else {
      securityService.signIn(to.path)
    }
  }
});

