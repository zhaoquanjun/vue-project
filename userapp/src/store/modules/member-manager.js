import { getAppPolicies, getUserInfo, getBeInvitedUsers, updateUserPolicy, batchUpdateUserPolicy, deleteCurMember, batchDeletMember, getShortUrlByInviation } from "@/api/index";
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
            if (info === 1) {// info =1  清空已选成员 =》 邀请成员
                state.memberInfo = null;
                state.memberPolicy = [];
                return
            };
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
            // state.userPermission = state.userPermission.filter((item) => {
            //     return item !== payload
            // })
            state.memberPolicy.push(payload);
        },
        /**
         * 删除已选的某一项权限 && 添加到管理者的权限中去
         * @param {*} state 
         * @param {*} payload 
         */
        REMOVESELECTEDAUTH(state, payload) {
            state.memberPolicy = state.memberPolicy.filter((item) => {
                return item.nameSpace != payload.nameSpace
            });
            // state.userPermission.forEach((item,index)=>{
            //     if(item.nameSpace === payload.nameSpace){
            //         console.log()
            //         state.userPermission[index].show =false;
            //     }
            // })

            // state.userPermission.push(payload)
        },
        /**
         * 清空 已有的权限
         * @param {*} state 
        */
        EMPTYSELECTEDAUTH(state) {
            // state.memberPolicy.forEach((item) => {
            //     state.userPermission.push(item);
            // })

            state.memberPolicy = [];
        },

    },
    actions: {
        /**
        * 获取当前登录用户应用下的可配置的权限
        */
        async _getAppPolicies({ commit }, isBatch) {
            let { data: allPolicies, status } = await getAppPolicies();
            allPolicies.forEach((item, index) => {
                allPolicies[index].show = false
            })
            commit("USERPERMISSION", allPolicies)
            isBatch && commit("CURMEMBVERINFO", [])
        },
        /**
         * 当前成员的 信息 与 权限 
        */
        async _getUserInfo({ commit }) {
            let { data: userInfo, status } = await getUserInfo();
            commit("CURMEMBVERINFO", userInfo)
        },

        /**
         * 成员列表
         * @param {} param0 
         */
        async _getBeInvitedUsers({ commit }, options) {
            let { data: beInvitedUsers, status } = await getBeInvitedUsers(options);
            return beInvitedUsers
        },
        /**
         * 更新成员的权限
         * @param {*} param0 
         * @param {*} 
         */
        async _updateUserPolicy({ getters }) {

           await updateUserPolicy(getters.getSelectedAuthNames);

        },
        /**
         * 批量更新成员的权限
         * @param {更新的权限集合id} ids 
         */
        async _batchUpdateUserPolicy({ getters }, userids) {
            let options = {
                names: getters.getSelectedAuthNames,
                userids: userids
            }
            let jsonData = await batchUpdateUserPolicy(options);
            console.log(jsonData, '------0')
        },

        /**
         * 删除单个成员
         * @param {*} context 
         * @param {*} ids 
         */
        async _deleteCurMember({ commit }, item) {
            let jsonData = await deleteCurMember();
            return jsonData
            console.log(jsonData)
        },
        /**
         * 批量删除成员
         * @param {*} context 
         * @param {*} ids 
         */
        async _batchDeletMember(context, ids) {
            let jsonData = await batchDeletMember(ids);
        },
        async _getShortUrlByInviation() {
            let jsonData = await getShortUrlByInviation(getters.getSelectedAuthNames)
        },
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
         * 计算已选权限的name
         * @param {*} state 
         */
        getSelectedAuthNames(state) {
            let names = []
            state.memberPolicy && state.memberPolicy.forEach((item) => {
                names.push(item.name)
            });
            return names;
        }
    }
};
export default memberManager;
