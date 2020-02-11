import {
  isAuth
} from "@/api/request/account.js";
import store from "@/store/index";
import {setLocal} from '@/libs/local';
import { getCurSiteId } from "@/api/request/dashboardApi.js"
const user = {
  state: {
    wx_status: {
      isAuth: false,
      isResolveSuccess: false,
      isCertification: false
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
      setLocal("wx_status", payload)
    },
    SET_ACCOUNT_INFO: (state, payload) => { 
      state.account_info = payload;
      setLocal("account_info", payload)
    }
  },
  actions: {
    async _getWxStatus({commit, state}) {
      await store.dispatch('_setSiteId')
      let siteId =  store.state.dashboard.siteId
      let data = await isAuth({infoType: "WeixinOA",siteId: siteId});
      if (data && data.status == 200) {
        let verify = {
          isAuth: data.data.isAuth,
          isCertification: data.data.isVerify,
          isResolveSuccess: data.data.isResolveSuccess
          // isAuth: true,
          // isResolveSuccess: true,
          // isCertification: true
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
      }
    },
  }
}

export default user;