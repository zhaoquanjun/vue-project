import { setLocal, removeLocal } from '@/libs/local'
import { getUserProfile } from "@/api/index"
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
    async _getUserProfile({ commit }) {
      let { data } = await getUserProfile();
      console.log(data,'用户信息')
      commit("SET_USERINFO", data)
    },
  }
}

export default user;

