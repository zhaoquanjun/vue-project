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
        headImageUrl: payload.headImageUrl,
      }
      // vtfsjogp => userInfo
      setCookie("vtfsjogp", data)
    }
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

