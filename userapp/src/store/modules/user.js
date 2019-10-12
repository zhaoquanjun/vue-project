import { getAppHeadInfo } from "@/api/request/dashboardApi.js"
import { setLocal } from '@/libs/local'
const user = {
  state: {
    userInfo:""
  },
  mutations: {
    SET_USERINFO: (state, payload) => {
      state.userInfo = payload;
      setLocal("userInfo",payload)
    },
    
  },
  actions: {
    async _set(context,data){
      if (process.env.NODE_ENV === 'development') {
        await context.dispatch('_updateAppIdAndSiteIdToCookie')
      }
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

