import { getAppHeadInfo } from "@/api/request/dashboardApi.js"
// import { setLocal } from '@/libs/local';
import {setCookie} from "@/libs/cookie"
const user = {
  state: {
    userInfo:"",
    accessToken: { Authorization: '' },
  },
  mutations: {
    SET_USERINFO: (state, payload) => {
      state.userInfo = payload;
      let data = {
        appName: payload.appName,
        userName: payload.userName,
      }
      // uxp => userinfo
      setCookie("uxp", data)
      // setLocal("userInfo",payload)
    },
    SET_USER: (state, data) => {
      if (data) {
        state.accessToken.Authorization = data;
      } 
    },
  },
  actions: {
    async _set(context,data){
      // if (process.env.NODE_ENV === 'development') {
        await context.dispatch('_updateAppIdAndSiteIdToCookie')
      // }
      await context.dispatch('_getMenuListData')
      await context.dispatch('_getAppHeadInfo')
    },
    async _getAppHeadInfo({ commit }) {
      let { data } = await getAppHeadInfo();
      commit("SET_USERINFO", data)
    },
  }
}

export default user;

