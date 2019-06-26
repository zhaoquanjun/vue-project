import Vue from 'vue';
import VueRouter from 'vue-router';
import { defaultRoutes } from "./routes"
import securityService from "@/services/authentication/securityService";
import { getLocal } from "@/libs/local";
import store from "@/store/index";
Vue.use(VueRouter);

const router = new VueRouter({
    mode: "hash",
  //base: process.env.BASE_URL,
  routes: defaultRoutes
});
export default router;
//
let flag = false;
router.beforeEach(async (to, from, next) => {
  // to.path 路由表配置  是否需要登录  && 登录 并且检验有权限 ，， 权限为空 只要登录就可以访问 
  //  route配置多个权限 任意一个就可访问  
  if(to.path==="/404" || to.path === '/500'){
    next();
    
  }else{
    if (getLocal("token")) {
      await store.dispatch('_getUserDashboard')
      await store.dispatch('_getMenuListData')
      let r = await store.dispatch('getCurRouteAuth', to.path);
      console.log(r)
      if (r ) {
        next()
      }else{
        // console.log(router); return false;
        router.replace('/404')
      }
  
    } else {
      if (to.name !== "callback") {
        if (to.meta.requiresAuth) {
          securityService.getUser().then(async (data) => {
            if (!data) {
              securityService.signIn();
              next()
            } else {
              store.commit("SET_USER", data)
              await store.dispatch('_getUserDashboard')
              await store.dispatch('_getMenuListData')
              console.log(data)
              next()
            }
          })
        } else {
          next()
        }
  
      } else {
        next()
      }
    }
  }


});





