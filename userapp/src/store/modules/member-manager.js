import { getAppPolicies, getEditUserAppPolicies, getUserPolicy, getBeInvitedUsers, updateUserPolicy, batchUpdateUserPolicy, deleteCurMember, batchDeletMember, getShortUrlByInviation, updateUserRemark, getUserDashboard} from "@/api/index";
const memberManager = {
   // namespaced: false,
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
            if (info["policyNames"]) {
                state.memberPolicy = info["policyNames"];
            }
        },
        /**
         * 用户权限信息
         */
        USERPERMISSION: (state, info) => {
            console.log(info,'jajjajajjajja')
            state.userPermission = info;
            // 当前成员已有的权限          
            setTimeout(()=>{
                let memberPolicy = state.memberPolicy;
                let userPermission =  state.userPermission;
                userPermission.forEach((item)=>{
                    if(memberPolicy.includes(item.name)){
                       // item.show = true;
                        item.isChoosed = true;
                    }else{
                        //item.show = false;
                        item.isChoosed = false;
                    }
                })
            },500)
           
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
            payload.isChoosed = true;
            state.memberPolicy.push(payload.name);
        },
        /**
         * 删除已选的某一项权限 && 
         * @param {*} state 
         * @param {*} payload 
         */
        REMOVESELECTEDAUTH(state, payload) {
            console.log(state.memberPolicy)
            console.log(payload)
            payload = payload.name||payload;// 选择权限 或 者已选权限  数据结构不通
            state.memberPolicy = state.memberPolicy.filter((item) => {
                // return item.name != payload.name
                //修改 0610 
                return item != payload
            });
            // 取消默认选择背景颜色
            state.userPermission.forEach((item)=>{
                if(item.name == payload){
                    //item.show = false
                    item.isChoosed = false;
                }
            })
        },
        /**
         * 清空 已有的权限
         * @param {*} state 
        */
        EMPTYSELECTEDAUTH(state) {
            state.userPermission.forEach((item, index) => {
                item.isChoosed = false;//item.show = false
            });
            state.memberPolicy = [];
        },

    },
    actions: {
        /**
        * 获取当前登录用户应用下的可配置的权限
        */
        async _getAppPolicies({ commit }, isBatch) {
            let { data: allPolicies, status } = await getAppPolicies();            
            commit("USERPERMISSION", allPolicies)
            isBatch && commit("CURMEMBVERINFO", [])
        },
        async _getEditUserAppPolicies({ commit }, userId) {
            let { data: allPolicies, status } = await getEditUserAppPolicies(userId);
            allPolicies.forEach((item, index) => {
                //allPolicies[index].show = false;
                allPolicies[index].isChoosed = false;
            })
            commit("USERPERMISSION", allPolicies)
             commit("CURMEMBVERINFO", [])
        },
        /**
         * 当前成员的 信息 与 权限 
        */
        async _getUserPolicy({ commit },userId) {
            let { data: userInfo, status } = await getUserPolicy(userId);
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
        async _updateUserPolicy({ getters }, datas) {
            console.log(datas);
            let options = {
                names:getters.getSelectedAuthNames,
                remark: datas.remark,
                userId: datas.userId,
                appId:'',
            }
           let jsonData = await updateUserPolicy(options);
           return jsonData;
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
            return jsonData;
           
        },

        /**
         * 删除单个成员
         * @param {*} context 
         * @param {*} ids 
         */
        async _deleteCurMember({state,commit }, item) {
            let options = {
                sourceUserId: state.userId,
                targetUserIds:[item.userId],
                appId: item.appId
            }
            let jsonData = await batchDeletMember(options);
            console.log(jsonData,'member文件')
            return jsonData
           
        },
        /**
         * 批量删除成员
         * @param {*} state 
         * @param {*} ids 
         */
        async _batchDeletMember({state}, params) {
            console.log(params)
            let options = {
                sourceUserId: state.userId,
                targetUserIds:params.ids,
                appId: params.appId
            }
            let jsonData = await batchDeletMember(options);
            return jsonData;
        },
        async _getShortUrlByInviation() {
            let jsonData = await getShortUrlByInviation(getters.getSelectedAuthNames)
        },
        async _updateUserRemark(context,data){
            await updateUserRemark(data.targetUserId,data.remark);
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
         * 计算已选权限的name
         * @param {*} state 
         */
        getSelectedAuthNames(state) {
            let names = []
            state.memberPolicy && state.memberPolicy.forEach((item) => {
               // names.push(item.name)
               names.push(item)
            });
            return names;
        }
    }
};
export default memberManager;
