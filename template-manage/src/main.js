import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import './plugins/element';

// public begin
import "@/styles/common.scss";
import "@/styles/theme-chalk/index.scss"
import "@/styles/elementui-reset/index.scss"
//  public end

// 防抖 节流函数
import Debounce from '@/globalComponents/debounce'
Vue.component('Debounce', Debounce)

import Loading from './globalComponents/loading.js'
Vue.use(Loading)
Vue.config.productionTip = false;
//插件的包
import PerfectScrollbar from 'perfect-scrollbar';
//对应的css
import "perfect-scrollbar/css/perfect-scrollbar.css";
/**
 * @description 自动判断该更新PerfectScrollbar还是创建它
 * @param {HTMLElement} el - 必填。dom元素
 */
const el_scrollBar = (el) => {
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update();
  } else {
    //el上挂一份属性
    el._ps_ = new PerfectScrollbar(el, {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20,

    });
  }
};
Vue.directive("scrollBar", {
  //使用inserted钩子函数（初次创建dom）获取使用自定义指令处的dom
  inserted(el, binding, vnode) {

    const rules = ["fixed", "absolute", "relative"];
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`)
    }
    //el上挂一份属性
    el_scrollBar(el);
  },
  //更新dom的时候
  componentUpdated(el, binding, vnode, oldVnode) {
    try {
      //vnode.context其实就是vue实例，这里其实无需实例也直接用Vue的静态方法
      //故而也可以写成Vue.nextTick
      vnode.context.$nextTick(
        () => {
          el_scrollBar(el);
        }
      )
    } catch (error) {
      console.error(error);
      el_scrollBar(el);
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");