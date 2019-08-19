import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import './plugins/element';
import "./plugins/element-reset.scss"
import "./assets/reset.css";
import "./styles/common.scss";
import "./styles/pop-up/pup-up.scss"
import "./styles/weizhan.scss";
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");