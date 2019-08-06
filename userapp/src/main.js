import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/reset.css";
import "./styles/common.scss";
import "./plugins/element-reset.css"
import "./styles/pop-up/pup-up.scss"
import './icons'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// 验证码滑块
import SliderVerificationCode from 'slider-verification-code';
import 'slider-verification-code/lib/slider-verification-code.css';
Vue.use(SliderVerificationCode);
//import '@/icons'
Vue.use(ElementUI)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
