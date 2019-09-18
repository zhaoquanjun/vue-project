<template>
  <div class="popup-content__area">
    <p class="popup-content__title">请填写链接地址</p>
    <el-input
      type="url"
      size="small"
      v-model="url"
      placeholder="如：www.clouddream.net"
      @input="_handleInputChange"
      @blur="_handleInputBlur"
    ></el-input>
    <p class="error-tips" :style="{visibility: !isLinkUrl ? 'visible' : 'hidden'}">
      <span></span>请输入正确的链接地址
    </p>
    <div class="popup-content__open">
      <p>页面打开方式</p>
      <div class="way-list__box">
        <el-radio v-model="way" label="_self">当前窗口打开</el-radio>
        <el-radio v-model="way" label="_blank" style="margin-left: 24px;">新窗口打开</el-radio>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object
    },
    selectedUrl: {
      type: String
    },
    way: {
      type: String
    },
    type: {
      type: String
    },
    curType: {
      type: String
    }
  },
  data() {
    return {
      url: "",
      isLinkUrl: true
    };
  },
  created() {
    this.url = this.curType == 'link' ? this.selectedUrl : '';
  },
  methods: {
    _handleInputChange(val) {
      this.url = val;
      let reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
      if (reg.test(this.url)) {
        this.$emit("handleChangeUrl", {url: this.url, title: this.url, cType: 'link'});
      }
    },
    _handleInputBlur() {
      let reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
      if (reg.test(this.url)) {
        this.isLinkUrl = true;
        this.$emit("handleChangeUrl", {url: this.url, title: this.url, cType: 'link'});
      } else {
        this.isLinkUrl = false;
      }
      console.log(this.isLinkUrl);
    }
  },
  watch: {
    selectedUrl() {
      this.url = this.curType == 'link' ? this.selectedUrl : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  .popup-content__title {
    font-size: 12px;
    line-height: 17px;
    color: #00c1de;
    padding: 20px 12px 16px;
    cursor: auto;
  }
  .error-tips {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 12px;
    padding-top: 8px;
    padding-bottom: 10px;
    font-size: 12px;
    line-height: 17px;
    visibility: hidden;
    span {
      margin-right: 8px;
      display: block;
      width: 12px;
      height: 12px;
      background: url("~img/link/error_tips.png") no-repeat center
        center;
      background-size: 100% 100%;
    }
  }
  .popup-content__open {
    margin-top: 16px;
    padding: 16px 16px 0;
    width: 590px;
    height: 78px;
    border-top: 1px solid #eee;
    p {
      padding: 0 0 12px;
      font-size: 12px;
      line-height: 17px;
      color: #00C1DE;
    }
    .way-list__box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .way-list__box {
      .el-radio__label {
        font-size: 12px;
        color: #262626;
      }
    } 
    .way-list__box {
      .is-checked {
        .el-radio__inner {
          border-color: #00c1de;
          background: #00c1de;
        }
      }
    } 
  }
}
.popup-content__area {
  .el-input__inner {
    margin-left: 12px;
    width: 560px;
    height: 32px;
    line-height: 32px;
    padding-left: 8px;
    border-radius: 0;
    text-align: left;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(229, 229, 229, 1);
  }
} 
</style>
