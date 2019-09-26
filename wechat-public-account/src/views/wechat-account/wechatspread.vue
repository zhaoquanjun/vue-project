<template>
  <div class="account-setting__section">
    <div class="account-setting__manage">
      <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
      />
     </div>
     <div>微信推广</div>
  </div>
</template>

<script>
import ChangeSite from "@/components/common/changeSite";
import { unBind } from "@/api/request/account.js";
import { notify } from "@/utlis/index.js";
export default {
  data() {
    return {
      siteId: this.$store.state.dashboard.siteId
    };
  },
  components: {
    ChangeSite
  },
  created() {
    this._getWxIsAuth();
  },
  methods: {
    getSiteId(siteId) {
      console.log('000')
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this._getWxIsAuth()
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      console.log(this.$store.state.wxaccount)
      if (!wx_status.isAuth || !wx_status.isCertification) {
        this.$router.replace({path:'/wechataccount/wxauther' });
      }
      this.accountInfo = this.$store.state.wxaccount.account_info
    }
  }
};
</script>
<style lang="scss" scoped>
</style>