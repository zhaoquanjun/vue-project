import Vue from 'vue';
import VueRouter from 'vue-router';
import {defaultRoutes} from "./routes"
import securityService from "@/services/authentication/securityService";
import { getLocal } from "@/libs/local";
import store from "@/store/index";
Vue.use(VueRouter); 

const router =  new VueRouter({
    mode: "history",
    //base: process.env.BASE_URL,
    routes: defaultRoutes
});
export default router;
//
router.beforeEach( async (to, from, next) => {
// to.path 路由表配置  是否需要登录  && 登录 并且检验有权限 ，， 权限为空 只要登录就可以访问 
//  route配置多个权限 任意一个就可访问  
    if (getLocal("token")) {
       // to
         store.dispatch('_getMenuListData').then((data)=>{
           console.log(data,'0000data')
          let resourceUrls = data.resourceUrls;
          if(!resourceUrls.includes('404')){
              
          }else{
            next()
          }
         });
         
        
         
    } else {
    
      if (to.name !== "callback") {
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
      }else{
        next()
      }
    }
  
  });