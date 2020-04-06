import Vue from "vue";
import VueRouter from "vue-router";
import { defaultRoutes } from "./routes";
import securityService from "@/services/authentication/securityService";
import store from "@/store/index";
import { getCookie } from "@/libs/cookie";
import { errorUrl } from "@/environment/index";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: defaultRoutes
});
export default router;

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  if (to.path.includes("ssologin")) {
    next();
    return;
  }
  let user = await securityService.getUser();
  let accessToken;
  if (user) {
    accessToken = user.access_token;
  }
  if (accessToken) {
    if (to.path !== "/callback") {
      if (store.getters.getMenuList.length < 1) {
        await store.dispatch("_getMenuListData");
      }
      if (!to.meta.requiresAuth) {
        next();
        return;
      }
      // vtfsjogp => userinfo
      if (!getCookie("vtfsjogp")) {
        await store.dispatch("_getAppHeadInfo");
      }
      // 上传需要appId
      // if (process.env.NODE_ENV === "development") {
      let appId = store.state.dashboard.appId;
      if (!appId) {
        await store.dispatch("_updateAppIdAndSiteIdToCookie");
      }
      // }
      let r = await store.dispatch("getCurRouteAuth", to.path);
      if (r) {
        if (to.path.includes("/website")) {
          let haveTemplate = await store.dispatch("_haveTemplate");
          if (!haveTemplate) {
            next("/website/selectTemplate");
            return;
          }
        }
      } else {
        window.location.href = errorUrl;
        return;
      }
    }
    next();
  } else {
    if (to.path == "/callback") {
      next();
    } else {
      securityService.signIn(to.path);
    }
  }
});
