import { setLocal, removeLocal } from '@/libs/local'
import { getAppHeadInfo } from "@/api/request/dashboardApi.js"
const user = {
  state: {
    accessToken: { Authorization: '' },
    avatar: "",
    userInfo:""
  },

  mutations: {
    SET_USER: (state, data) => {
      console.log(user,'000000000')
      if (data) {
        state.accessToken.Authorization = data.access_token;
        setLocal('token', data.access_token,data.expires_at);
      } else {
        state.accessToken.Authorization = '';
        removeLocal('token');
      }
    },
    SET_USERINFO: (state, payload) => {
      state.userInfo = payload;
      // setLocal("userInfo",payload)
    },
    
  },
  actions: {
    async _set(context,data){
     
      await context.commit("SET_USER",data)
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

