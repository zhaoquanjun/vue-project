import Vue from "vue";
import Vuex from "vuex";
import dashboard from "./modules/dashboard";
import user from "./modules/user";
Vue.use(Vuex);
import { getLocal } from "@/libs/local";
import { getCookie } from "@/libs/cookie";
const store = new Vuex.Store({
  modules: {
    dashboard,
    user
  },
  state: {
    accessToken: { Authorization: "" }
  },
  mutations: {},
  actions: {},
  getters: {}
});
export default store;

/**
 * 页面刷新再将local中的token 写入store中
 */

if (getCookie("tjufje")) {
  store.commit("SETSITEID", getCookie("tjufje"));
}

if (getCookie("bqqje")) {
  store.commit("SETAPPID", getCookie("bqqje"));
}
if (getCookie("vtfsjogp")) {
  store.commit("SET_USERINFO", JSON.parse(getCookie("vtfsjogp")));
}
