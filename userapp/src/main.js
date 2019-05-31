import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/reset.css";
import "./styles/common.scss";
import securityService from "@/services/authentication/securityService";
import { getLocal } from "./libs/local"
Vue.use(ElementUI)
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  if (getLocal("token")) {
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
