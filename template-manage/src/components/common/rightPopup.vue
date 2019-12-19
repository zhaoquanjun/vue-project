<template>
  <div>
    <el-drawer
      :show-close="false"
      :wrapperClosable="false"
      size="400px"
      :visible.sync="myPopupShow"
      :before-close="closePopup"
      class="popup-wrap"
    >
      <div class="popupTitle" slot="title">
        <span class="popupTitle-text">
          <slot name="titleName"></slot>
        </span>
        <i class="iconfont iconguanbi cl-iconfont is-circle" @click="closePopup"></i>
      </div>
      <div class="popupContent" v-scrollBar>
        <slot name="content"></slot>
      </div>
      <footer>
        <div class="popupConfirm">
          <Debounce :time="1000" !isDebounce>
            <button
              class="confirmBtn cl-button cl-button--primary cl-button--small"
              @click="confirm"
            >
              <slot name="confirmName">确定</slot>
            </button>
          </Debounce>
          <button class="cl-button cl-button--primary_notbg cl-button--small" @click="closePopup">取消</button>
        </div>
      </footer>
    </el-drawer>
  </div>
</template>
<script>
export default {
  props: {
    popupShow: {
      type: Boolean
    }
  },
  data() {
    return {
      myPopupShow: this.popupShow
    };
  },
  watch: {
    popupShow() {
      this.myPopupShow = this.popupShow;
    }
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    confirm() {
      this.$emit("confirm");
    }
  }
};
</script>
<style>
.el-popup-parent--hidden {
  padding-right: 0px !important;
}
</style>
<style lang="scss" scoped>
.popup-wrap {
  /deep/ .el-drawer__header {
    padding: 16px 24px 0;
    margin: 0;
  }
}
.popupTitle {
  border-bottom: $--border-base;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  .popupTitle-text {
    font-size: $--font-size-base;
    font-weight: $--font-weight-base;
    color: $--color-text-primary;
  }
}
.popupContent {
  height: calc(100vh - 135px);
  max-height: calc(100vh - 135px);
  padding: 0 24px;
  position: relative;
}
.popupConfirm {
  width: calc(100% - 48px);
  height: 80px;
  border-top: 1px solid #d7d8d9;
  padding: 16px 0 32px;
  margin: 0 24px;
  box-sizing: border-box;
}
</style>


