
import { getUserCurrentAppPolicy, getUserDashboard, getSliderMenuList} from "@/api/index"
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
        //currentAppId
        data && commit("GETUSERDASHBOARD", data.lastLoginOutAppId)
    },
    async _getMenuListData({ commit }) {
      let { data } = await getSliderMenuList();
      data && commit("GETVALIDATEMENU", data)
      return data
    }
};
export default actions;
