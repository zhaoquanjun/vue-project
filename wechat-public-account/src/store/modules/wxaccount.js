import {
  isAuth
} from "@/api/request/account.js";
const user = {
  state: {
    wx_status: {
      isAuth: true,
      isCertification: true
    },
    account_info: {}
  },
  getters: {
    wx_status: state => state.wx_status,
    account_info: state => state.account_info
  },
  mutations: {
    SET_WX_STATUS: (state, payload) => {
      state.wx_status = payload;
    },
    SET_ACCOUNT_INFO: (state, payload) => { 
      state.account_info = payload;
    }
  },
  actions: {
    async _getWxStatus({commit}) {
      let data = await isAuth({openPlatformType: "WeixinOA"});
      let verify = {
        isAuth: data.isAuth,
        isCertification: data.isVerify
      }
      let accountInfo = {
        platformName: data.platformNiceName,
        platformAvator: data.platformHeadImg,
        serviceTypeInfo: data.serviceTypeInfo
      }
      commit("SET_WX_STATUS", verify);
      commit("SET_ACCOUNT_INFO", accountInfo)
    },
  }
}

export default user;