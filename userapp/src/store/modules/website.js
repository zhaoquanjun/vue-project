const website = {
  state: {
    isChooseModul:false,
    curCode:""
  },

  mutations: {
    SETMODUL(state,payload){
        state.isChooseModul=payload
    },
    SETCODE(state,payload){
      state.curCode=payload
  }
  },
  actions: {
    xx({commit}){
        commit("SETMODUL",1)
    }
  }
}

export default website;
