import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import './plugins/element';
import "./assets/reset.css";
import "./styles/common.scss";
import "./plugins/element-reset.scss"
import "./styles/weizhan.scss";
import "@/directive/index.js"
import { getLocal } from "./libs/local";
import './icons';
import securityService from "@/services/authentication/securityService";
Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");