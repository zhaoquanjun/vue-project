import { getAppPolicies, getUserInfo } from "@/api/index"
const login = {
    state: {
        curmemberInfo: null,
    },
    mutations: {
        CURMEMBERINFO: (state, info) => {
            state.curmemberInfo = info;
        }
    },
    actions: {
        async _getAppPolicies({commit}) {
            let allPolicies = await getAppPolicies();
            commit("CURMEMBERINFO",allPolicies)
           // console.log(allPolicies)
        },
        async _getUserInfo() {
            let allPolicies = await getUserInfo();
          //  console.log(allPolicies)
        }
    },
    getters: {

    }
};
export default login;
