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
  if (!to.meta.requiresAuth) {
    debugger
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
      alert(1)
      debugger
      securityService.getUser().then(async (data) => {
        if (!data) {
          alert(2)
          debugger
         console.log(data)
          securityService.signIn();
          next()
        } else {
          alert(JSON.stringify(data))
          console.log(data)
          console.log(data)
          debugger
          store.commit("SET_USER", data);
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