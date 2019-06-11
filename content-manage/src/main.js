import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import './plugins/element';
import "./assets/reset.css";
import "./styles/common.scss";
import "./plugins/element-reset.css"
import './icons';
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
