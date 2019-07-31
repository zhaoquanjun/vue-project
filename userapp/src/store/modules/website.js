const website = {
  state: {
    isChooseModul:false
  },

  mutations: {
    SETMODUL(state,payload){
        state.isChooseModul=payload
    }
  },
  actions: {
    xx({commit}){
        commit("SETMODUL",1)
    }
  }
}

export default website;
