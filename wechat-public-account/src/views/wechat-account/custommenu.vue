<template>
  <div class="define-menu__section">
    <page-sub-nav :title="title"></page-sub-nav>
    <div class="define-menu__content" v-if="isVerify">
      <warm-pronpt :desc="tips" style="margin-top: 16px;"></warm-pronpt>
      <div class="menu-setting__area">
        <define-menu ></define-menu>
      </div>
    </div>
    <account-certification v-else></account-certification>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import PageSubNav from "_c/common/WechatTitle";
import WarmPronpt from "_c/wechat-account/menu/warm-prompt";
import DefineMenu from "_c/wechat-account/menu/define-menu";
import AccountCertification from '_c/wechat-account/defineMenu/account-wxcertification';
export default {
  data() {
    return {
      title: "自定义菜单",
      tips:
        "温馨提示：自定义菜单发布后因为微信缓存不会立即更新，但对新关注用户立即生效，若需查看，请取消关注并重新关注后查看。"
    };
  },
  components: {
    PageSubNav,
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
  }
};
</script>

<style lang="scss" scoped>
.define-menu__section {
  padding: 32px 32px 0;
  height: 100%;
  .define-menu__content {
    width: 100%;
    height: calc(100% - 73px);
    .menu-setting__area {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 100px);
      min-height: 800px;
    }
  }
}
</style>