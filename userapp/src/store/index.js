import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import * as getters from "./getters";
import login from "./modules/login";
import user from "./modules/user";
import dashboard from "./modules/dashboard";
import website from "./modules/website"
import memberManager from "./modules/member-manager";
import {setLocal,getLocal} from "@/libs/local"
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
  actions,
  getters
});
export default store;

/**
 * 页面刷新再将local中的token 写入store中
 */
if (sessionStorage.getItem("token")){
  let obj = {
      access_token: getLocal("token"),
    }
    let appid = getLocal("appid")
    store.commit("SETAPPID", appid)
    store.commit("SET_USER", obj)
  
    // getLocal("menulist") && store.commit("set_menuList",JSON.parse(getLocal("menulist")))
     getLocal("authList")&& store.commit("set_authList",JSON.parse(getLocal("authList")))
}
if(sessionStorage.getItem("siteId")){
 store.commit("SETSITEID",sessionStorage.getItem("siteId"))
}