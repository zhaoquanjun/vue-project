import { getAppPolicies, getUserInfo } from "@/api/index"
const memberManager = {
    namespaced: false,
    state: {
        userInfo: null,
        userPermission: "",
    },
    mutations: {
        CURLOGININFO: (state, info) => {
            state.userInfo = info;
        },

        USERPERMISSION: (state, info) => {
            state.userPermission = info;
        },
    },
    actions: {
        /**
        * 获取当前用户应用下的可配置的权限
        */
        async _getAppPolicies({ commit }) {
            let allPolicies = await getAppPolicies();
            commit("USERPERMISSION", allPolicies)
        },
        /**
         * 当前登录用户用户信息 与 权限 
        */
        async _getUserInfo({ commit }) {
            let userInfo = await getUserInfo();
            commit("CURLOGININFO", userInfo)
        }
    },
    getters: {}
};
export default memberManager;
