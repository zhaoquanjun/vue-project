import * as types from "./mutation-types.js"
import { setLocal } from '@/libs/local'
const mutations = {
   
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
     * 右侧邀请面板
     * @param {*} state 
     * @param {*} flag 
     */
    [types.ISINVITATIONPANELSHOW](state, flag) { state.isInvitationPanelShow = flag; },
    /**
     * 
     * @param {*} state 
     * @param {获取到用户信息} payload 
     */
    [types.USERCURRENTAPPPOLICY](state, payload) { state.userCurAppPolicy = payload },

    [types.GETUSERDASHBOARD](state, payload) {

        state.appid = payload;
        setLocal('appid', payload);
    },
};
export default mutations;