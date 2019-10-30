import Vue from 'vue';
import VueRouter from 'vue-router';
import { defaultRoutes } from "./routes"
import securityService from "@/services/authentication/securityService";
import store from "@/store/index";
import { getCookie } from "@/libs/cookie"
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: defaultRoutes
});
export default router;


router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  if (to.path.includes("ssologin")) {
    next()
    return
  }
  let user = await securityService.getUser();
  let accessToken;
  if (user) {
    accessToken = user.access_token;
  };
  if (accessToken) {
    if (to.path !== "/callback") {
      if (!to.meta.requiresAuth) {
        next()
        return
      }
      if (to.path === "/404") {
        next()
        return
      }
      if(getCookie("userInfo") ){
          await store.dispatch("_getAppHeadInfo");//临时
      }
      
      // 切换app 主动调接口   本地测试调用
      if (process.env.NODE_ENV === "development") {
        let appId = store.state.dashboard.appId;
        if (!appId) { await store.dispatch('_updateAppIdAndSiteIdToCookie') }
      }
      let r = await store.dispatch('getCurRouteAuth', to.path);
      if (r) {
        if (store.getters.getMenuList.length < 1) {
          await store.dispatch('_getMenuListData')
        }

        if (to.path.includes("/website")) {
          let haveTemplate = await store.dispatch('_haveTemplate');
          if (!haveTemplate) {
            next("/website/selectTemplate")
            return
          }
        }
      } else {
        next("/404")
        return
      }
    }
    next()

  } else {
    if (to.path == "/callback") {
      next()
    } else {
      securityService.signIn(to.path)
    }
  }
});