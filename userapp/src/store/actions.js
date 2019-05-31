
import {getUserCurrentAppPolicy} from "@/api/index"
const actions = {
  async _getUserCurrentAppPolicy({commit}){
    let userCurrentAppPolicy =await getUserCurrentAppPolicy();
    commit("")
  }
};
export default actions;
