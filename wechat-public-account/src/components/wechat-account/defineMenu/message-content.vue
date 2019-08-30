<template>
  <div class="menu-content__section">
    <section class="menu-content__area">
      <div class="radio-tabs">
        <el-radio-group v-model="radio">
          <el-radio :label="'picture'">图片</el-radio>
          <el-radio :label="'words'">文字</el-radio>
          <el-radio :label="'pricure_words'">图文</el-radio>
        </el-radio-group>
      </div>
      <div class="slot-content">
        <div class="slot-item">
          <slot></slot>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    menuData: {
      type: Object
    }
  },
  data() {
    return {
      radio: 'picture'
    };
  },
  methods: {
    changeReplyContent(val) {
      console.log(val)
    }
  },
};
</script>
<style scoped>
.menu-content__area /deep/ .el-radio-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>
<style lang="scss" scoped>
.menu-content__section {
  .menu-content__area {
    margin-left: -24px;
    width: calc(100% + 48px);
    min-height: 364px;
    border-top: 1px solid #c9d9dc;
    .radio-tabs {
      padding: 18px 16px;
      border-bottom: 1px solid #c9d9dc;
    }
    .slot-content {
      height: 364px;
      .slot-item {
        width: 100%;
        height: 364px;
      }
    }
  }
}
</style>