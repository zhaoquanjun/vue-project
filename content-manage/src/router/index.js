import Vue from 'vue';
import VueRouter from 'vue-router';
import { defaultRoutes } from "./routes"
import store from "@/store/index";
import securityService from "@/services/authentication/securityService";
import Cookies from "js-cookie"
Vue.use(VueRouter);
let router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: defaultRoutes
});
export default router;
let accessToken = store.state.accessToken.Authorization;
let flag = false;
router.beforeEach(async (to, from, next) => {
  console.log(to)

  if (!to.meta.requiresAuth) {
    await store.dispatch('_updateAppIdToCookie')
    store.dispatch('_getMenuListData')
    
    next()
    return
  }
  if (accessToken) {
    if (!Cookies.get('AppId')) {
      await store.dispatch('_updateAppIdToCookie')
      next()
    }
    let r = await store.dispatch('getCurRouteAuth', to.path);
    if (r) {
      if (store.getters.getMenuList.length < 1) {
        await store.dispatch('_getMenuListData')
      }
      next()
    } else {
      next('/404')
    }
  } else {
    if (to.name !== "callback") {
      securityService.getUser().then(async (data) => {
        if (!data) {
          securityService.signIn();
          next()
        } else {
          store.commit("SET_USER", data);
          await store.dispatch('_updateAppIdToCookie')
          await store.dispatch('_getMenuListData')
          next()
        }
      })
    } else {
      next()
    }
  }
});

    // if(store.getters.getMenuList.length<1){
        //     await store.dispatch('_getMenuListData')
        //     let authRoute = await store.dispatch('getAuthRoute');
        //     console.log(authRoute,'拿到权限路由')
        //     if(!flag){
        //       router.addRoutes(authRoute)
        //       next({...to,replace:true});
        //       console.log(router)
        //     }else{
        //       next()
        //     }

        //   }else{
        //     next()
        //   }