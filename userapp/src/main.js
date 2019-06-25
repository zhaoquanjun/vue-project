import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/reset.css";
import "./styles/common.scss";
import './icons'
import { getLocal } from "@/libs/local";
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
//import '@/icons'
Vue.use(ElementUI)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
