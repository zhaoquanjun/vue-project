<template>
  <div class="dialog-mask--area" v-show="dialogShow">
    <div class="translate-progress--content">
      <div class="modal-header--area">
        <div class="model-title ellipsis">
          {{ progressInfo && progressInfo.title && progressInfo.title }}
        </div>
        <div class="close-btn" @click="hideSelf">
          <i class="iconfont iconguanbi cl-iconfont is-circle"></i>
        </div>
      </div>
      <div class="modal-content--area">
        <div class="modal-content__icon"></div>
        <div class="modal-content__progress">
          <el-progress
            :stroke-width="6"
            :percentage="
              progressInfo && progressInfo.progress ? progressInfo.progress : 0
            "
            :color="customColor"
          ></el-progress>
        </div>
        <p class="modal-content__progress--tips attention">
          阿里智能AI正在为您翻译...
        </p>
        <ul class="modal-content__advantage">
          <li v-for="(item, index) in advantage" :key="index">
            <i class="iconfont iconicon-des-right1"></i>{{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progressInfo: {
      type: Object
    }
  },
  data() {
    return {
      dialogShow: false,
      advantage: [
        "最先进的端到端深度学习框架，千万级多语学习库；",
        "多样化应用场景，单机单句百毫秒级解码，整站翻译只需几秒；",
        " 智能纠错系统，翻译服务可靠性高达99.99%"
      ],
      customColor: "#FF6A00"
    };
  },
  methods: {
    showSelf() {
      this.dialogShow = true;
    },
    hideSelf() {
      this.dialogShow = false;
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
  .translate-progress--content {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    padding: 30px 25px 32px;
    width: 430px;
    height: 343px;
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

      .modal-content__icon {
        margin: 0 auto;
        width: 93px;
        height: 73px;
        background: url("~img/content-icon/translate_progress.png") no-repeat
          center center;
        background-size: 100% 100%;
      }

      .modal-content__progress {
        margin-top: 24px;
      }

      .modal-content__progress--tips {
        margin-top: 14px;
        text-align: center;
      }

      .modal-content__advantage {
        margin-top: 22px;
        margin-left: 15px;

        li {
          font-size: $--font-size-small;
          line-height: 24px;
          color: $--color-text-primary;

          i.iconfont {
            margin-right: 8px;
          }
        }
      }
    }
  }
}

.dialog-mask--area /deep/ .el-progress {
  text-align: center;

  .el-progress-bar {
    width: 312px;
    height: 6px;

    .el-progress-bar__outer {
      background-color: #f0f3f7;
    }
  }

  .el-progress__text {
    margin-left: 15px;
    font-size: $--font-size-base;
    color: $--color-text-regular;
  }
}
</style>
