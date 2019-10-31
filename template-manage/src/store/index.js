import Vue from "vue";
import Vuex from "vuex";
import dashboard from "./modules/dashboard";
import user from "./modules/user";
Vue.use(Vuex);

import { getLocal } from '@/libs/local'

const store = new Vuex.Store({
  modules: {
    dashboard,
    user
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {}
});
export default store;



/**
 * 页面刷新再将local中的token 写入store中
 */
getLocal("authList")&& store.commit("set_authList",getLocal("authList"))
getLocal("menulist")&& store.commit("set_menuList",getLocal("menulist"))
if(getCookie("tjufje")){
  store.commit("SETSITEID",getCookie("tjufje"))
}

if(getLocal("ymId")){
    store.commit("SETAPPID",getLocal("ymId"))
}