<template>
  <div class="website-content__section">
    <div class="content-header__area">设置链接</div>
    <div class="content-content__area">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {
    
  }
};
</script>

<style lang="scss" scoped>
.website-content__section {
  margin-left: -16px;
  width: calc(100% + 32px);
  height: 100%;
  .content-header__area {
    height: 62px;
    line-height: 62px;
    padding-left: 16px;
    font-size: 16px;
    font-family: "PingFangSC";
    font-weight: 400;
    color: rgba(161, 168, 177, 1);
    border-top: 1px solid #c9d9dc;
    border-bottom: 1px solid #c9d9dc;
  }
  .content-content__area {
    width: 100%;
    min-height: 364px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>