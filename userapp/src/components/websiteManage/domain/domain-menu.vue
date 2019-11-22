<template>
  <div class="domain-menu">
    <el-tabs v-model="backupType" @tab-click="handleTabClick('')">
      <el-tab-pane label="域名列表" name="domainList"></el-tab-pane>
      <el-tab-pane label="301重定向" name="301Redirect"></el-tab-pane>
    </el-tabs>
    <button class="backupBtn cl-button cl-button--primary" @click="handleBtn">{{handlerBtnText}}</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      backupType: "domainList",
      handlerBtnText: "添加域名"
    };
  },
  methods: {
    /**
     * 切换列表
     */
    handleTabClick(backupType) {
      this.backupType = backupType || this.backupType;
      this.$emit("handleTabClick", this.backupType);
      if (this.backupType == "301Redirect") {
        this.handlerBtnText = "添加重定向";
      } else {
        this.handlerBtnText = "添加域名";
      }
    },
    /**
     * 点击右侧btn
     */
    handleBtn() {
      this.$emit("handleBtn", this.backupType);
    }
  }
};
</script>

<style lang="scss" scoped>
.domain-menu {
  position: relative;
  height: 50px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  margin-bottom: 12px;
}
.domain-menu /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.el-tabs /deep/ .el-tabs__active-bar.is-top {
  width: 0 !important;
}
.el-tabs /deep/ .el-tabs__item {
  height: 50px;
  line-height: 50px;
  margin: 0 24px;
  padding: 0;
  color: $--color-text-primary;
}
.el-tabs /deep/ .el-tabs__item.is-active {
  border-bottom: 2px solid $--color-primary;
}
.backupBtn {
  position: absolute;
  right: 16px;
  top: 9px;
}
</style>

