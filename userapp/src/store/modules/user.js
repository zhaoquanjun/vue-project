import {setLocal,removeLocal} from '@/libs/local'

const user = {
  state: {
    accessToken: { Authorization: '' },
  },

  mutations: {
    SET_USER: (state, user) => {
      if (user) {
        state.accessToken.Authorization = user.access_token;
        setLocal('token',user.access_token);
      } else {
        state.accessToken.Authorization = '';
        removeLocal('token');
      }
    },
   
  },
  actions: {
   
  }
}

export default user;

