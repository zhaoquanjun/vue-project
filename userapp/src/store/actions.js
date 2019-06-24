
import { getUserCurrentAppPolicy, getUserDashboard} from "@/api/index"
const actions = {
  async _getUserCurrentAppPolicy({commit}){
    let userCurrentAppPolicy =await getUserCurrentAppPolicy();
    commit("")
    },
    async _getUserDashboard({ commit }) {
      
        let { data } = await getUserDashboard();
        if (data == null) {
            data = await getUserDashboard();
        }
        console.log(data);
        data && commit("GETUSERDASHBOARD", data.lastLoginOutAppId)
    }
};
export default actions;
