<template>
  <div class="define-menu__section">
    <ChangeSite
      @chooseWebsite="chooseWebsite"
      @getSiteId="getSiteId"
    />
    <div class="define-menu__content">
      <div class="menu-setting__area">
        <define-menu ></define-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import PageSubNav from "_c/common/WechatTitle";
import ChangeSite from "@/components/common/changeSite";
import WarmPronpt from "_c/wechat-account/menu/warm-prompt";
import DefineMenu from "_c/wechat-account/menu/define-menu";
import {getLocal} from '@/libs/local'
import AccountCertification from '_c/wechat-account/defineMenu/account-wxcertification';
export default {
  data() {
    return {
      title: "自定义菜单"
    };
  },
  components: {
    PageSubNav,
    ChangeSite,
    WarmPronpt,
    DefineMenu,
    AccountCertification
  },
  computed: {
    ...mapGetters(["wx_status"]),
    ...mapState(['dashboard']),
    isVerify: {
      get: function() {
        return this.wx_status.isCertification ? true : false;
      },
      set: function() {}
    }
  },
  created() {
    let wx_status = this.$store.state.wxaccount.wx_status || getLocal("wx_status")
    if (!wx_status.isCertification) {
        this._getWxIsAuth()
    }
  },
  methods: {
    getSiteId(siteId) {
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this._getWxIsAuth()
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      await this.$store.dispatch('_setSiteId')
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
        this.$router.replace({path:'/wechataccount/wxauther' });
      }
      this.accountInfo = this.$store.state.wxaccount.account_info
    },
  }
};
</script>

<style lang="scss" scoped>
.define-menu__section {
  padding: 10px 32px 0;
  height: 100%;
  .define-menu__content {
    width: 100%;
    height: calc(100% - 73px);
  }
}
</style>