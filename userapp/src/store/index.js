import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import * as getters from "./getters";
import login from "./modules/login";
import user from "./modules/user";
import memberManager from "./modules/member-manager"
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    login,
    user,
    memberManager
  },
  state,
  mutations,
  actions,
  getters
});
