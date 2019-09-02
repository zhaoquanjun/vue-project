import Vue from "vue";
import Vuex from "vuex";
import dashboard from "./modules/dashboard";
import user from "./modules/user";
import wxaccount from './modules/wxaccount';
Vue.use(Vuex);

import { setLocal, getLocal, removeLocal } from '@/libs/local'

const store = new Vuex.Store({
  modules: {
    dashboard,
    user,
    wxaccount
  },
  state: {
    accessToken: { Authorization: '' },
    isAsideDialogShow:false,
  },
  mutations: {
    SET_USER: (state, user) => {
      if (user) {
        state.accessToken.Authorization = user.access_token;
        setLocal('token', user.access_token);
      } else {
        state.accessToken.Authorization = '';
        removeLocal('token');
      }
    },
    SET_DIALOG:(state,payload)=>{
       state.isAsideDialogShow = payload
    }
  },
  actions: {
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_USER', null)
        resolve()
      })
    }
  },
  getters: {
    token: state => state.accessToken.Authorization,
  }
});
export default store;



/**
 * 页面刷新再将local中的token 写入store中
 */
if (getLocal("token")) {
  let obj = {
    access_token: getLocal("token"),
  }
  store.commit("SET_USER", obj)
  // // getLocal("menulist") && store.commit("set_menuList",JSON.parse(getLocal("menulist")))
  getLocal("authList") && store.commit("set_authList", JSON.parse(getLocal("authList")))
}
if(getLocal("ymId")){
    store.commit("SETAPPID", getLocal("ymId"))
}

if(getLocal("userInfo")){
  store.commit("SET_USERINFO",JSON.parse(getLocal("userInfo")))
}


