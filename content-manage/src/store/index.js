import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import {setLocal} from '@/libs/local'
const store =  new Vuex.Store({
  state: {
    accessToken: { Authorization: '' },
  },
  mutations: {
    SET_USER: (state, user) => {
      if (user) {
        state.accessToken.Authorization = user.access_token;
        setLocal('token',user.access_token);
      } else {
        state.accessToken.Authorization = '';
        removeLocal('token');
      }
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
if(localStorage.getItem("token")){
  let obj = {
    access_token:localStorage.getItem("token")
  }
  store.commit("SET_USER", obj)
}
