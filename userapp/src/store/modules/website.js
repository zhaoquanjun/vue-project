const website = {
  state: {
    isChooseModul:false,
    navItem:""
  },

  mutations: {
    SETMODUL(state,payload){
        state.isChooseModul=payload
    },
    SETCODE(state,payload){
      console.log(payload)
      state.navItem=payload
  }
  },
  actions: {
   
  }
}

export default website;
