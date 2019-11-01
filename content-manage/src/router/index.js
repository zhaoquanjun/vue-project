import Vue from 'vue';
import VueRouter from 'vue-router';
import { defaultRoutes } from "./routes"
import { getLocal } from "@/libs/local"
import store from "@/store/index";
import securityService from "@/services/authentication/securityService";
import { getCookie } from "@/libs/cookie"

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
    accessToken = user.access_token;
  }
  if (accessToken) {
    if (to.path !== "/callback") {
      if (!to.meta.requiresAuth) {
        next()
        return
      }
      // vtfsjogp => userinfo
      if (!getCookie("vtfsjogp")) {
        await store.dispatch("_getAppHeadInfo");
      }
      if (!appId) { await store.dispatch('_updateAppIdAndSiteIdToCookie') }
      if (store.getters.getMenuList.length < 1) await store.dispatch('_getMenuListData')
      let r = await store.dispatch('getCurRouteAuth', to.path);
      if (r) {
        next()
      } else {
        next('/404')
      }
    } else {
      next()
    }
  } else {
    if (to.path == "/callback") {
      next()
    } else {
      securityService.signIn(to.path)
    }
  }

});

