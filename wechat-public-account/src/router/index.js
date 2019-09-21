import Vue from 'vue';
import VueRouter from 'vue-router';
import { defaultRoutes } from "./routes"
import store from "@/store/index";
import securityService from "@/services/authentication/securityService";

import {setLocal,getLocal,removeLocal} from '@/libs/local'
Vue.use(VueRouter);
let router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: defaultRoutes
});
export default router;
let accessToken = store.state.accessToken.Authorization;
let appId =  store.state.dashboard.appId;
let siteId =  store.state.dashboard.siteId;
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  if (!to.meta.requiresAuth) {
    if (!appId) {
      await store.dispatch('_updateAppIdToCookie')
    }
    if (!siteId) {
      await store.dispatch('_setSiteId')
    }
    store.dispatch('_getMenuListData')
    next()
    return
  }
  if (to.name !== "callback") {
    if (accessToken) {
      if (!appId) {
        await store.dispatch('_updateAppIdToCookie')
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
        if (!store.getters.wx_status.isAuth) {
          await store.dispatch('_getWxStatus')
          let wx_status = store.state.wxaccount.wx_status;
          if (!wx_status.isAuth || !wx_status.isCertification) {
            //next('/wechataccount/wxauther');
            return;
          }
        }
        next()
      } else {
        next('/404')
      }
    } else {
        securityService.getUser().then(async (data) => {
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

     