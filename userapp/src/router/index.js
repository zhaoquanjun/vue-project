import Vue from 'vue';
import VueRouter from 'vue-router';
import { defaultRoutes } from "./routes"
import securityService from "@/services/authentication/securityService";
import { getLocal } from "@/libs/local";
import store from "@/store/index";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  //base: process.env.BASE_URL,
  routes: defaultRoutes
});
export default router;
let accessToken = store.state.user.accessToken.Authorization;
router.beforeEach(async (to, from, next) => {

  document.title = to.meta.title;
 

  
    if (to.name !== "callback") {
      if (accessToken) {
        if (!to.meta.requiresAuth) {
          if (!getLocal('ymId')) {
            await store.dispatch('_updateAppIdAndSiteIdToCookie')
          }
          store.dispatch('_getMenuListData')
          next()
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
          securityService.getUser(location.href).then(async (data) => {
            if (!data) {
              securityService.signIn();
              return
            } else {
              store.dispatch("_set", data)
              console.log(data)
              next()
            }
          })
      }
    } else {
      next()
    }
  
});

