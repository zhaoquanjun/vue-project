import Vue from 'vue';
import VueRouter from 'vue-router';
import {defaultRoutes} from "./routes"
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
   
  if (accessToken) {
        if(!Cookies.get('AppId')){
            await store.dispatch('_getUserDashboard')
            next()
        }else{
          next()
        }
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
        
          
       
  } else {
    if (to.name !== "callback") {
      securityService.getUser().then((data) => {
        if (!data) {
          securityService.signIn();
          next()
        } else {
          console.log(data)
          store.commit("SET_USER", data)
          next()
        }      
      })
    }else{
      next()
    }
  }
});