import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import mutations from "./mutations";
import login from "./modules/login";
import user from "./modules/user";
import dashboard from "./modules/dashboard";
import website from "./modules/website"
import memberManager from "./modules/member-manager";
import { getLocal } from "@/libs/local"
import { getCookie } from "@/libs/cookie"

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    login,
    user,
    memberManager,
    dashboard,
    website
  },
  state,
  mutations,

});
export default store;

/**
 * 页面刷新再将local中的token 写入store中
 */

if (getCookie("tjufje")) {
  store.commit("SETSITEID", getCookie("tjufje"))
}

if (getCookie("bqqje")) {
  store.commit("SETAPPID", getCookie("bqqje"))
}
if (getCookie("vtfsjogp")) {
  store.commit("SET_USERINFO", JSON.parse(getCookie("vtfsjogp")))
}