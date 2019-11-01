import Vue from "vue";
import Vuex from "vuex";
import dashboard from "./modules/dashboard";
import user from "./modules/user";
import wxaccount from './modules/wxaccount';
Vue.use(Vuex);
import { getCookie } from "@/libs/cookie"
import { setLocal, getLocal, removeLocal } from '@/libs/local'

const store = new Vuex.Store({
  modules: {
    dashboard,
    user,
    wxaccount
  },
  state: {
    isAsideDialogShow: false,
  },
  mutations: {
    SET_DIALOG: (state, payload) => {
      state.isAsideDialogShow = payload
    }
  },
  actions: {},
  getters: {}
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