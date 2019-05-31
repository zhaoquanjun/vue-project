import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/reset.css";
import "./styles/common.scss";
import Mgr from './services/authentication/securityService';
Vue.use(ElementUI)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    Mgr.getRole().then(
        sucess => {
          if (to.meta.role == sucess){
            next();
          }else {
            next('/accessdenied');
          }
        },
        err => {
          console.log(err);
        }
      );    
  } else {
    next();
  }
});