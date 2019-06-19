import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import * as getters from "./getters";
import login from "./modules/login";
import user from "./modules/user";
import memberManager from "./modules/member-manager";

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    login,
    user,
    memberManager
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
if(localStorage.getItem("token")){
  let obj = {
      access_token: localStorage.getItem("token"),
     

    }
    let appid = localStorage.getItem("appid")
    store.commit("GETUSERDASHBOARD", appid)
  store.commit("SET_USER", obj)
}