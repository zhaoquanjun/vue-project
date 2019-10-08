import {
  isAuth
} from "@/api/request/account.js";
import store from "@/store/index";
import { getCurSiteId } from "@/api/request/dashboardApi.js"
const user = {
  state: {
    wx_status: {
      isAuth: false,
      isResolveSuccess: false,
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
    async _getWxStatus({commit, state}) {
      await store.dispatch('_setSiteId')
      let siteId =  store.state.dashboard.siteId
      let data = await isAuth({infoType: "WeixinOA",siteId: siteId});
      let verify = {
        // isAuth: data.data.isAuth,
        // isCertification: data.data.isVerify,
        // isResolveSuccess: data.data.isResolveSuccess
        isAuth: true,
        isResolveSuccess: true,
        isCertification: false
      }
      let accountInfo = {
        platformName: data.data.platformNiceName,
        platformAvator: data.data.platformHeadImg,
        serviceTypeInfo: data.data.serviceTypeInfo,
        promotionUrl: data.data.promotionUrl,
        platformAppId: data.data.platformAppId
      }
      commit("SET_WX_STATUS", verify);
      commit("SET_ACCOUNT_INFO", accountInfo)
    },
  }
}

export default user;