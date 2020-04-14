<template>
  <div
    class="dialog-mask--area"
    :class="{ 'transform-move--top': dialogShow }"
    v-show="dialogShow"
  >
    <div class="dialog-info--modal">
      <div class="modal-header--area">
        <div class="model-title ellipsis">{{ infoModal.title }}</div>
        <div class="close-btn" @click="hideSelf">
          <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
        </div>
      </div>
      <div class="modal-content--area">
        <div class="content-attribute--icon">
          <i
            class="iconfont iconxingzhuangjiehe success"
            v-show="infoModal.type == 'success'"
          ></i>
          <i
            class="iconfont iconicon-exclamationmark fail"
            v-show="infoModal.type == 'fail'"
          ></i>
        </div>
        <div class="content-desc--word" v-html="infoModal.content"></div>
      </div>
      <div class="modal-btn--area">
        <p v-show="infoModal.additional.words">
          {{ infoModal.additional.words }}
        </p>
        <div
          v-show="infoModal.btn.btn1Text"
          class="cl-button cl-button--primary_notbg confirm"
          style="min-width: 76px; width: 76px; box-sizing: border-box;"
          @click="_handleConfirm"
        >
          {{ infoModal.btn.btn1Text }}
        </div>
        <div
          v-show="infoModal.btn.btn2Text"
          class="cl-button cl-button--primary cancle"
          style="min-width: 76px; width: 76px; box-sizing: border-box;"
          @click="_handleCancle"
        >
          {{ infoModal.btn.btn2Text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoModal: {
      type: Object,
      dafault: () => {
        return {
          title: "提示",
          type: "success",
          content: "这是一段实例文字",
          btn: {
            btn1Text: "",
            btn2Text: "",
            btn1Operate: "",
            btn2Operate: ""
          },
          additional: { words: "", operate: "" }
        };
      }
    }
  },
  data() {
    return {
      dialogShow: false,
      interval: 5,
      tips: "",
      timer: null
    };
  },
  methods: {
    showSelf() {
      this.dialogShow = true;
      this.interval = 5;
      this._setIntervalEvent();
    },
    hideSelf() {
      this.dialogShow = false;
    },
    stopIntervalEvent() {
      this.timer && clearInterval(this.timer);
    },
    _handleConfirm() {
      if (this.infoModal.btn.btn1Operate) {
        this.$emit(this.infoModal.btn.btn1Operate);
      }
    },
    _handleCancle() {
      if (this.infoModal.btn.btn2Operate) {
        this.$emit(this.infoModal.btn.btn2Operate);
      }
    },
    _setIntervalEvent() {
      if (
        this.infoModal.additional.words &&
        this.infoModal.additional.operate
      ) {
        this.tips = this.infoModal.additional.words;
        this.infoModal.additional.words = this.interval + "s" + this.tips;
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(() => {
          if (this.interval > 1) {
            --this.interval;
            this.infoModal.additional.words = this.interval + "s" + this.tips;
          } else {
            clearInterval(this.timer);
            this.hideSelf();
            this.$emit(this.infoModal.additional.operate);
          }
        }, 1000);
      }
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
  .dialog-info--modal {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    padding: 30px 25px 32px;
    min-width: 450px;
    max-width: 500px;
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
      align-items: flex-start;

      .content-attribute--icon {
        margin-top: 12px;
        margin-left: 35px;

        i {
          font-size: 32px;
        }

        i.success {
          color: $--color-success;
        }

        i.fail {
          color: $--color-primary;
        }
      }

      .content-desc--word {
        padding-left: 16px;
        padding-right: 30px;
        line-height: 26px;
        font-size: $--font-size-base;
        overflow: hidden;
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
