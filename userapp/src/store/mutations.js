import * as types from "./mutation-types.js"
import { setLocal } from '@/libs/local'
let Base64 = require('js-base64').Base64;


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
    [types.GETVALIDATEMENU](state, payload) {
       // Base64.encode()
        setLocal('validateMenu',payload);
        state.validateMenu = payload;
       
        // setLocal('validateMenu', payload);
    },
    set_menuList(state,m){
        state.menuList = m;
      },
      set_authList(state, a){
        state.authList = a;
        state.hasRules = true;
      },
};
export default mutations;