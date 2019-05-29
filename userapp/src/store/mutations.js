import * as types from "./mutation-types.js"
const mutations = {
    /**
     * 点击选择全限
     * @param {*} state 
     * @param {*} payload 
     */
    [types.CHOOSEAUTH](state, payload) { state.selectedAuth.push(payload); },
    /**
     * 移除已选择的权限
     * @param {*} state 
     * @param {*} payload 
     */
    [types.REMOVESELECTEDAUTH](state, payload) {
        state.selectedAuth = state.selectedAuth.filter((item) => item.name != payload.name)
    },
    /**
     * 是否显示  右侧面板（权限配置）
     * @param {*} state 
     * @param {*} flag 
     */
    [types.ISRIGHTPANNELSHOW](state, flag) { state.isRightPanelShow = flag; },
    /**
     * 关闭右侧面板
     * @param {*} state 
     * @param {*} flag 
     */
    [types.CLOSERIGHTPANNEL](state, flag) {
        state.isRightPanelShow = flag;
        state.isInvitationPanelShow = flag;
    },
    /**
     * 清空 已选的权限
     * @param {*} state 
     */
    [types.EMPTYSELECTEDAUTJ](state) { state.selectedAuth = []; },
    /**
     * 右侧邀请面板
     * @param {*} state 
     * @param {*} flag 
     */
    [types.ISINVITATIONPANELSHOW](state, flag) { state.isInvitationPanelShow = flag; }
};
export default mutations;