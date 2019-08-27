import { getAppHeadInfo } from "@/api/request/common.js"
const user = {
  state: {
    userInfo:""
  },
  mutations: {
    SET_USERINFO: (state, payload) => {
      state.userInfo = payload;
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

