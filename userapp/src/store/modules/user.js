import {setLocal} from '@/libs/local'
function getUserRole(user) {
  var roles = []
  var roleObj = user.profile.role
  if (roleObj) {
    if (typeof roleObj === 'string') {
      roles.push(roleObj)
    } else {
      roles = roleObj
    }
  }
  return roles
}
const user = {
  state: {
    user: null,
    name: '',
    token: '',
    accessToken: { Authorization: '' },
    userImg: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
      if (user) {
        state.roles = getUserRole(user)
        state.token = user.access_token
        state.accessToken.Authorization = 'Bearer ' + state.token;
        setLocal('token',user.access_token);
      } else {
        state.roles = []
        state.token = ''
        state.accessToken.Authorization = ''
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

export default user
