import { setLocal } from '@/libs/local'
import { getAppHeadInfo } from "@/api/request/user.js"
const user = {
  state: {
    userInfo:""
  },
  mutations: {
    SET_USERINFO: (state, payload) => {
      state.userInfo = payload;
      //setLocal("userInfo",payload)
    }
  },
  actions: {
    async _getAppHeadInfo({ commit }) {
      let { data } = await getAppHeadInfo();
      commit("SET_USERINFO", data)
    },
  }
}

export default user;

