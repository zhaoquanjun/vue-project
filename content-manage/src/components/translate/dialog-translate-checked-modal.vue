<template>
  <div class="dialog-mask--area" v-show="dialogShow">
    <div class="dialog-translate--modal">
      <div class="modal-header--area">
        <div class="model-title ellipsis" v-show="checkInfo && checkInfo.title">
          {{ checkInfo.title }}
        </div>
        <div class="close-btn" @click="hideSelf">
          <i class="iconfont iconguanbi"></i>
        </div>
      </div>
      <div class="modal-content--area" v-show="checkInfo && checkInfo.content">
        <div class="content-attribute--icon"></div>
        <div class="content-desc--word" v-html="checkInfo.content"></div>
      </div>
      <div class="modal-btn--area">
        <p
          v-show="
            checkInfo && checkInfo.additional && checkInfo.additional.operate
          "
        >
          <span
            @click.stop="_handleChangeCheckStatus"
            class="check-icon"
            :class="{ 'is-checked': checkInfo.additional.status }"
          ></span>
          记住操作，不再提示我
        </p>
        <div
          v-show="checkInfo && checkInfo.btn && checkInfo.btn.btn1Text"
          class="cl-button cl-button--primary_notbg confirm"
          @click="_handleConfirm"
        >
          {{ checkInfo.btn.btn1Text }}
        </div>
        <div
          v-show="checkInfo && checkInfo.btn && checkInfo.btn.btn2Text"
          class="cl-button cl-button--primary cancle"
          @click="_handleCancle"
        >
          {{ checkInfo.btn.btn2Text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkInfo: {
      type: Object,
      dafault: () => {
        return {
          title: "自动翻译",
          content: "这是一段实例文字",
          btn: {
            btn1Text: "确定",
            btn1Operate: "",
            btn2Text: "取消",
            btn2Operate: ""
          },
          additional: {
            operate: "",
            status: false
          }
        };
      }
    }
  },
  data() {
    return {
      dialogShow: false,
      interval: 5,
      tips: ""
    };
  },
  methods: {
    showSelf() {
      this.dialogShow = true;
    },
    hideSelf() {
      this.dialogShow = false;
    },
    _handleConfirm() {
      if (this.checkInfo.btn.btn1Operate) {
        this.$emit(
          this.checkInfo.btn.btn1Operate,
          this.checkInfo.additional.status
        );
      }
    },
    _handleCancle() {
      if (this.checkInfo.btn.btn2Operate) {
        this.$emit(this.checkInfo.btn.btn2Operate);
      }
    },
    _handleChangeCheckStatus() {
      this.$set(
        this.checkInfo.additional,
        "status",
        !this.checkInfo.additional.status
      );
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
  z-index: 2999;
  background-color: rgba(0, 0, 0, 0.75);
  .dialog-translate--modal {
    position: absolute;
    top: 45%;
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
        min-width: 51px;
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
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: $--font-size-small;
        color: $--color-warning;

        .check-icon {
          position: relative;
          margin-right: 8px;
          display: block;
          width: 12px;
          height: 12px;
          border: 1px solid $--border-color-base;
          border-radius: 50%;
          cursor: pointer;

          &::after {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            content: "";
            width: 8px;
            height: 8px;
            background-color: $--color-primary;
            border-radius: 50%;
            cursor: pointer;
          }
        }

        .is-checked {
          border-color: $--color-primary;
          &::after {
            display: block;
          }
        }
      }

      .confirm,
      .cancle {
        box-sizing: border-box;
        min-width: 76px;
        width: auto;
      }
    }
  }
  .transform-move--top {
    transform: translateY(-5%);
  }
}
</style>
