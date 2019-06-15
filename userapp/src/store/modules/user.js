import {setLocal} from '@/libs/local'

const user = {
  state: {
    accessToken: { Authorization: '' },
  },

  mutations: {
    SET_USER: (state, user) => {
      if (user) {
        state.accessToken.Authorization = 'Bearer ' + user.access_token;
        setLocal('token','Bearer ' +user.access_token);
      } else {
        state.accessToken.Authorization = '';
        removeLocal('token');
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

