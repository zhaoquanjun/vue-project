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

router.beforeEach(async (to, from, next) => {
  
  if(!to.meta.requiresAuth){
   
    store.dispatch('_getMenuListData')
     next()
    return
  }
  if (getLocal("token")) {
         next()
    let r = await store.dispatch('getCurRouteAuth', to.path);
    if (r) {
      if(store.getters.getMenuList.length<1){
        await store.dispatch('_getMenuListData')
      }
      next()
    } else {
     next('/404')
    }
  } else {
    if (to.name !== "callback") {
      securityService.getUser(location.href).then(async (data) => {
        console.log(data,'dadddd')
        if (!data) {
          securityService.signIn();
          next()
        } else {
          store.commit("SET_USER", data);
          await store.dispatch('_getUserDashboard')
          await store.dispatch('_getMenuListData')
          next()
        }
      })
    } else {
      next()
    }
  }
});

// router.beforeEach( (to, from, next) => {
//   if (getLocal("token")) {
//         next()
//   } else {

//     if (to.name !== "callback") {
//         securityService.getUser().then(async (data) => {
//         if (!data) {
//           securityService.signIn();
//           next()
//         } else {           
//             store.commit("SET_USER", data)
//            await store.dispatch('_getUserDashboard')
//             console.log(data)
//           next()
//         }      
//       })
//     }else{
//       next()
//     }
//   }
// });

// router.beforeEach(async (to, from, next) => {
//   if (getLocal("token")) {
//         next()
//     // let r = await store.dispatch('getCurRouteAuth', to.path);
//     // if (r ) {
//     //   next()
//     // } else {
//     //     router.replace('/404')
//     // }
//   }else{
//     alert(JSON.stringify(to))
//     if (to.name !== "callback") {
//         securityService.getUser().then(async (data) => {
//         if (!data) {
//           securityService.signIn();
//           next()
//         } else {
//           console.log(data)
//           store.commit("SET_USER", data)
//           await store.dispatch('_getUserDashboard')
//           await store.dispatch('_getMenuListData')
//           next()
//         }      
//       })
//     }else{
//       next('/callback')
//     }
//   }
// })


//
// let flag = false;
// router.beforeEach(async (to, from, next) => {

//   if(to.path==="/404" ){
//     next()
//     return
//   }
//   if (getLocal("token")) {

//     await store.dispatch('_getMenuListData')
//     let r = await store.dispatch('getCurRouteAuth', to.path);
//     if (r &&to.name !== "callback") {
//       next()
//     }else{
//       if (to.path !== "/callback") {
//           router.replace('/404')
//       }
//     }

//   } else {
//     alert(JSON.stringify(to))
//     if (to.path !== "/callback") {
//       if (to.meta.requiresAuth) {
//         securityService.getUser().then(async (data) => {
//           console.log(data)
//           if (!data) {
//             alert(JSON.stringify(data+"ddddddddd"))


//             securityService.signIn();           
//           } else {
//             alert("ccccc")
//             store.commit("SET_USER", data)
//             await store.dispatch('_getUserDashboard')
//             await store.dispatch('_getMenuListData')
//             next()
//           }
//         })
//       } else {
//         alert("vvvvvv")
//         next()
//       }
//     }else{
//       alert("aaaa")
//       next()
//     }
//   }  
// });

/**
// to.path 路由表配置  是否需要登录  && 登录 并且检验有权限 ，， 权限为空 只要登录就可以访问
  //  route配置多个权限 任意一个就可访问
  if(to.path==="/404"){
   // next();

  }else{
    if (getLocal("token")) {
      // if(!store.state.menuList){
      //   await store.dispatch('_getMenuListData')
      // }
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


*/


