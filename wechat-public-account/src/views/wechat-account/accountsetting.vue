<template>
  <div class="account-setting__section">
    <page-sub-nav :title="title"></page-sub-nav>
    <div class="scroll-section">
      <not-bind v-if="!author"></not-bind>
      <not-certification v-if="author && !certification"></not-certification>
      <account-manage v-if="author && certification"></account-manage>
    </div>
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import NotBind from "_c/wechat-account/account/not-bind";
import NotCertification from "_c/wechat-account/account/not-certification";
import AccountManage from "_c/wechat-account/account/account-manage";
import { isAuth } from "@/api/request/account.js";
export default {
  data() {
    return {
      title: "账号设置",
      author: false,
      certification: false,
      accountInfo: {
        platformName: "",
        platformAvator: "",
        platformType: 0
      }
    };
  },
  components: {
    PageSubNav,
    NotBind,
    NotCertification,
    AccountManage
  },
  created() {
    this._getWxIsAuth();
  },
  methods: {
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      let data = await isAuth({ openPlatformType: "WeixinOA" });
      this.author = data.isAuth;
      this.certification = data.isVerify;
      this.accountInfo.platformName = data.platformNiceName;
      this.accountInfo.platformAvator = data.platformHeadImg;
      this.accountInfo.platformType = data.platformType;
    }
  }
};
</script>

<style lang="scss" scoped>
.account-setting__section {
  box-sizing: border-box;
  padding: 32px 32px 0;
  height: 100%;
}
</style>