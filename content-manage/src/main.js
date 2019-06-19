import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import './plugins/element';
import "./plugins/element-reset.css"
import "./assets/reset.css";
import "./styles/common.scss";
import "./styles/weizhan.scss";
import "@/directive/index.js"
import { getLocal } from "./libs/local";
import './icons';
import securityService from "@/services/authentication/securityService";
Vue.config.productionTip = false;

let accessToken = store.state.accessToken.Authorization
router.beforeEach((to, from, next) => {
  if (accessToken) {
        next()
  } else {
    if (to.name !== "callback") {
      securityService.getUser().then((data) => {
        if (!data) {
          securityService.signIn();
          next()
        } else {
          store.commit("SET_USER", data)
          next()
        }      
      })
    }else{
      next()
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");