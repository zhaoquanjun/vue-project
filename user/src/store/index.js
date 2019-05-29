import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import * as getters from "./getters";
import login from "./modules/login";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    login
  },
  state,
  mutations,
  actions,
  getters
});
