import {
  isAuth
} from "@/api/request/account.js";
const user = {
  state: {
    wx_status: {
      isAuth: false,
      isCertification: false
    },
    account_info: {},
    menu_reply_behavior: {
      name: '111',
      ClickBehavior: 'message',
      BehaviorType: 'picture'
    }
  },
  getters: {
    wx_status: state => state.wx_status,
    account_info: state => state.account_info,
    menu_reply_behavior: state => state.menu_reply_behavior
  },
  mutations: {
    SET_WX_STATUS: (state, payload) => {
      state.wx_status = payload;
    },
    SET_ACCOUNT_INFO: (state, payload) => { 
      state.account_info = payload;
    },
    SET_MENU_CLICK_BEHAVIOR: (state, payload) => {
      state.menu_reply_behavior.ClickBehavior = payload;
    },
    SET_MENU_BEHAVIOR_TYPE: (state, payload) => {
      state.menu_reply_behavior.BehaviorType = payload;
    }
  },
  actions: {
    async _getWxStatus({commit}) {
      let data = await isAuth({openPlatformType: "WeixinOA"});
      // debugger;
      let verify = {
        isAuth: data.data.isAuth,
        isCertification: data.data.isVerify
      }
      let accountInfo = {
        platformName: data.platformNiceName,
        platformAvator: data.platformHeadImg,
        serviceTypeInfo: data.serviceTypeInfo,
        platformAppId: data.platformAppId
      }
      commit("SET_WX_STATUS", verify);
      commit("SET_ACCOUNT_INFO", accountInfo)
    },
  }
}

export default user;