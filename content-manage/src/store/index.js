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
  state: {
    accessToken: { Authorization: '' },
    
  },
  mutations: {
    SET_USER: (state, data) => {
      if (data) {
        state.accessToken.Authorization = data;
      } 
    },
  },
  actions: {
   
  },
  getters: {
    
  }
});
export default store;



/**
 * 页面刷新再将local中的token 写入store中
 */

getLocal("authList")&& store.commit("set_authList",getLocal("authList"))

if (process.env.NODE_ENV === 'development') {
  if(getLocal("ymId")){
    store.commit("SETAPPID",getLocal("ymId"))
   }
}
if(getLocal("userInfo")){
  store.commit("SET_USERINFO",getLocal("userInfo"))
}
