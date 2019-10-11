import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  defaultRoutes
} from "./routes"
import store from "@/store/index";
import securityService from "@/services/authentication/securityService";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  setLocal,
  getLocal,
  removeLocal
} from '@/libs/local'
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
  NProgress.start()

  let user = await securityService.getUser();
  let accessToken;
  if(user){
    accessToken = user.access_token
  }
  if (to.name !== "callback") {
    if (!to.meta.requiresAuth) {
      if (!appId) {
        await store.dispatch('_updateAppIdToCookie')
      }
      store.dispatch('_getMenuListData')
      next()
      return
    }
    if (accessToken) {
      if (!appId) {
        await store.dispatch('_updateAppIdToCookie')
        next()
      }
      if (!getLocal("authList")) await store.dispatch('_getMenuListData');
      let r = await store.dispatch('getCurRouteAuth', to.path);
      if (r) {
        if (store.getters.getMenuList.length < 1) await store.dispatch('_getMenuListData')
        next()
      } else {
        next('/404')
      }
    } else {

      securityService.getUser().then(async (data) => {
        console.log(data,'----')
        if (!data) {
          securityService.signIn();
          next()
        } else {
          store.commit("SET_USER", data);
          await store.dispatch('_updateAppIdToCookie')
          await store.dispatch('_getMenuListData')
          await store.dispatch('_getAppHeadInfo')
          next()
        }
      })
    }
  } else {
    next()
  }

});

router.afterEach(() => {
  NProgress.done()
})