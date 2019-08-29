<template>
  <div class="define-menu__section">
    <page-sub-nav :title="title"></page-sub-nav>
    <div class="scroll-section">
      <warm-pronpt :desc="tips" style="margin-top: 16px;"></warm-pronpt>
      <div class="menu-setting__area">
        <define-menu></define-menu>
      </div>
    </div>
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import WarmPronpt from "_c/wechat-account/menu/warm-prompt";
import DefineMenu from "_c/wechat-account/menu/define-menu";
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
    DefineMenu
  }
};
</script>

<style lang="scss" scoped>
.define-menu__section {
  padding: 32px 32px 0;
  .menu-setting__area {
    margin-top: 166px;
  }
}
</style>