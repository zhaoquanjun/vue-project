<template>
  <div class="dialog-mask--area" v-show="dialogShow">
    <div class="dialog-translate--modal">
      <div class="modal-header--area">
        <div class="model-title ellipsis">{{ dialogInfo.title }}</div>
        <div class="close-btn" @click="hideSelf">
          <i class="iconfont iconguanbi"></i>
        </div>
      </div>
      <div class="modal-content--area">
        <div class="content-attribute--icon"></div>
        <div class="content-desc--word" v-html="dialogInfo.content"></div>
      </div>
      <div class="modal-btn--area">
        <p>{{ dialogInfo.additional.words }}</p>
        <div
          class="cl-button cl-button--primary_notbg confirm"
          style="min-width: 76px; width: 76px; box-sizing: border-box;"
          @click="_handleConfirm"
        >
          {{ dialogInfo.btn.confirmText }}
        </div>
        <div
          class="cl-button cl-button--primary cancle"
          style="min-width: 76px; width: 76px; box-sizing: border-box;"
          @click="_handleCancle"
        >
          {{ dialogInfo.btn.cancleText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dialogInfo: {
      type: Object,
      dafault: () => {
        return {
          title: "提示",
          type: "success",
          content: "这是一段实例文字",
          btn: { confirmText: "确定", cancleText: "取消" },
          confirm: "",
          cancle: "",
          additional: { words: "", operate: "" }
        };
      }
    }
  },
  data() {
    return {
      dialogShow: true,
      interval: 5,
      tips: ""
    };
  },
  created() {
    if (this.dialogInfo.additional.words) {
      this._setIntervalEvent();
    }
  },
  methods: {
    showSelf() {
      this.dialogShow = true;
    },
    hideSelf() {
      this.dialogShow = false;
    },
    _handleConfirm() {
      if (this.confirm) {
        this.$emit(this.confirm);
      } else {
        this.hideSelf();
      }
    },
    _handleCancle() {
      if (this.cancle) {
        this.$emit(this.cancle);
      } else {
        this.hideSelf();
      }
    },
    _setIntervalEvent() {
      this.tips = this.dialogInfo.additional.words;
      this.dialogInfo.additional.words = this.interval + "s" + this.tips;
      const timer = setInterval(() => {
        if (this.interval > 1) {
          --this.interval;
          this.dialogInfo.additional.words = this.interval + "s" + this.tips;
        } else {
          clearInterval(timer);
          this.hideSelf();
          this.$emit(this.dialogInfo.additional.operate);
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-mask--area {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;
  background-color: rgba(0, 0, 0, 0.75);
  .dialog-translate--modal {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 25px 32px;
    width: 450px;
    max-height: 600px;
    background-color: $--color-white;
    box-shadow: $--box-shadow-dark-small;
    border-radius: $--border-radius-base;
    transition: transform 0.3s linear;

    .modal-header--area {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .model-title {
        max-width: 380px;
        font-size: $--font-size-medium;
        color: $--color-text-primary;
        line-height: 22px;
      }
    }

    .modal-content--area {
      margin-top: 30px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .content-attribute--icon {
        margin-left: 20px;
        width: 51px;
        height: 40px;
        background: url("~img/content-icon/translate_icon.png") no-repeat center
          center;
        background-size: 100% 100%;
      }

      .content-desc--word {
        padding-left: 16px;
        line-height: 26px;
        font-size: $--font-size-base;
      }
    }

    .modal-btn--area {
      margin-top: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      p {
        margin-right: 16px;
        font-size: $--font-size-small;
        color: $--color-warning;
      }
    }
  }
  .transform-move--top {
    transform: translateY(-5%);
  }
}
</style>
