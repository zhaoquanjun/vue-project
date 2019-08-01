import { setLocal, removeLocal } from '@/libs/local'
import { getAppHeadInfo } from "@/api/request/dashboardApi.js"
const user = {
  state: {
    accessToken: { Authorization: '' },
    avatar: "",
    userInfo:""
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
    SET_USERINFO: (state, payload) => {
      state.userInfo = payload;
      setLocal(userInfo,payload)
    }
  },
  actions: {
    async _getAppHeadInfo({ commit }) {
      let { data } = await getAppHeadInfo();
      console.log(data,'用户信息')
      commit("SET_USERINFO", data)
    },
  }
}

export default user;

