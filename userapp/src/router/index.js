import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  defaultRoutes
} from "./routes"
import securityService from "@/services/authentication/securityService";
import {
  getLocal
} from "@/libs/local";
import store from "@/store/index";
import { TabPane } from 'element-ui';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  //base: process.env.BASE_URL,
  routes: defaultRoutes
});
export default router;

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  let user = await securityService.getUser();
  let accessToken;
  if (user) {
    accessToken = user.access_token;
  }
  if (to.path == "/signout-callback-oidc") {
    return
  }
  if (accessToken) {

    if (to.path !== "/callback") {
     
      if (!to.meta.requiresAuth) {
        if (!getLocal('ymId')) {
          await store.dispatch('_updateAppIdAndSiteIdToCookie')
        }
        store.dispatch('_getMenuListData')
        return
      }
      if (!parseFloat(getLocal('ymId'))) {
        await store.dispatch('_updateAppIdAndSiteIdToCookie')
      }
      let r = await store.dispatch('getCurRouteAuth', to.path);
      if (r) {
        if (store.getters.getMenuList.length < 1) {
          await store.dispatch('_getMenuListData')
        }
        if (to.path.includes("/website")) {
          let haveTemplate = await store.dispatch('_haveTemplate');
          if (!haveTemplate) {
            next('/website/selectTemplate')
          } else {
            next()
          }
        } else {
          next();
        }
      } else {
        next('/404')
      }
     
    } else {
     
      // securityService.getUser().then(async (data) => {
      //   if (!data) {
      //     securityService.signIn();
      //     return
      //   } else {
      //     store.dispatch("_set", data)
      //     next()
      //   }
      // })
      // store.dispatch("_set", data)
      next()
    }
  } else {
    if(to.path == "/callback" || to.path == "/401"){
      next()
    }else{
      securityService.signIn(to.path)
    }
   
  }

});