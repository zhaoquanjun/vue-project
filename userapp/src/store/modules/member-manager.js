import { getAppPolicies, getUserInfo, getBeInvitedUsers, updateUserPolicy, batchUpdateUserPolicy, batchDeleteUsers } from "@/api/index";
const memberManager = {
    namespaced: false,
    state: {
        memberInfo: null,
        memberPolicy: [],
        userPermission: [],
        
       
    },
    mutations: {
        /**
         * 当前成员的信息 含 权限
         */
        CURMEMBVERINFO: (state, info) => {
            if (info === 1) {
                state.memberInfo = null;
                state.memberPolicy = [];
                return
            }
            state.memberInfo = info;
            if (info["policy"]) {
                state.memberPolicy = info["policy"];
            }
        },
        /**
         * 用户权限信息
         */
        USERPERMISSION: (state, info) => {
            state.userPermission = info;
        },
        /**
         * 点击选择权限
         * @param {*} state 
         * @param {*} payload 
        */
        CHOOSEAUTH(state, payload) {
            state.userPermission = state.userPermission.filter((item) => {
                return item !== payload
            })
            state.memberPolicy.push(payload);
        },
        /**
         * 删除已选的某一项权限 && 添加到管理者的权限中去
         * @param {*} state 
         * @param {*} payload 
         */
        REMOVESELECTEDAUTH(state, payload) {
            state.memberPolicy = state.memberPolicy.filter((item) => item !== payload);
            state.userPermission.push(payload)
        },
        /**
         * 清空 已有的权限
         * @param {*} state 
        */
        EMPTYSELECTEDAUTH(state) {
            state.memberPolicy.forEach((item) => {
                state.userPermission.push(item);
            })

            state.memberPolicy = [];
        },

    },
    actions: {
        /**
        * 获取当前登录用户应用下的可配置的权限
        */
        async _getAppPolicies({ commit }, isBatch) {
            let {data:allPolicies,status} = await getAppPolicies();
            commit("USERPERMISSION", allPolicies)
            isBatch && commit("CURMEMBVERINFO", [])
        },
        /**
         * 当前成员的 信息 与 权限 
        */
        async _getUserInfo({ commit }) {
            let {data:userInfo,status} = await getUserInfo();
            commit("CURMEMBVERINFO", userInfo)
        },

        /**
         * 成员列表
         * @param {} param0 
         */
        async _getBeInvitedUsers({ commit }) {
            let {data:beInvitedUsers,status} = await getBeInvitedUsers();
            return beInvitedUsers
        },
        /**
         * 更新成员的权限
         * @param {*} param0 
         * @param {*} arrId 
         */
        async _updateUserPolicy({ commit }, arrId) {
            let {status} = await updateUserPolicy(arrId);
            console.log(status,'jsonDatajsonData')
        },
        /**
         * 批量更新成员的权限
         * @param {更新的权限集合id} ids 
         */
        async _batchUpdateUserPolicy({ commit }, ids) {
            let {status} = await batchUpdateUserPolicy(ids);
        },
        /**
         * 批量删除成员列表
         * @param {*} context 
         * @param {*} ids 
         */
        async _batchDeleteUsers(context, ids) {
            let jsonData = await batchDeleteUsers(ids);
        }
    },
    getters: {
        /**
         * 权限配置面板中   左边可选面板与右侧面板取差集
         * @param {*} state 
         */
        // formatAuthList(state) {
        //     let stateMem = new Set(state.memberPolicy);
        //     console.log(state.memberPolicy)
        //     console.log(stateMem)
        //     console.log(state.userPermission[0])
        //     console.log(stateMem.has(state.userPermission[0]))
        //     // return [...new Set(state.userPermission)].filter((item) => {
        //     //     console.log(state.memberPolicy,'state.memberPolicy',stateMem)
        //     //     console.log(new Set(state.memberPolicy).has(item))
        //     //     return new Set(state.memberPolicy).has(item);
        //     // })
        // },
        /**
         * 计算已选权限的ID
         * @param {*} state 
         */
        getSelectedAuthId(state) {
            let ids = []
            state.memberPolicy && state.memberPolicy.forEach((item) => {
                ids.push(item.id)
            });
            return ids;
        }
    }
};
export default memberManager;
