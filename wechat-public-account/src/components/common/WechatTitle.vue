<template>
  <div class="wechat-title">
    <span class="wechat-content">{{title}}</span>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    }
  }
};
</script>
<style lang="scss" scoped>
.wechat-title {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 24px;
  .wechat-content {
    border-left: 4px solid #01c0de;
    padding-left: 10px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>