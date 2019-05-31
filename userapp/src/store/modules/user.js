import {setLocal} from '@/libs/local'

const user = {
  state: {
    accessToken: { Authorization: '' },
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
      if (user) {
        state.accessToken.Authorization = 'Bearer ' + state.token;
        setLocal('token',user.access_token);
      } else {
        state.accessToken.Authorization = '';
        removeLocal('token',user.access_token);
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
  }
}

export default user;

