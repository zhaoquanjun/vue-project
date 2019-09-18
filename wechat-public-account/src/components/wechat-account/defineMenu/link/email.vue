<template>
  <div class="popup-content__area">
    <p class="popup-content__title">请填写邮件地址</p>
    <el-input
      type="email"
      size="small"
      v-model="email"
      placeholder="如：xxx@clouddream.net"
      @input="_handleInputChange"
      @blur="_handleInputBlur"
    ></el-input>
    <p class="error-tips" :style="{visibility: !isLinkEmail ? 'visible' : 'hidden'}">
      <span></span>请输入正确的邮箱地址
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
      email: "",
      isLinkEmail: true
    };
  },
  created() {
    this.email = this.curType == 'email' ? this.selectedUrl.split(':')[1] : '';
  },
  methods: {
    _handleInputChange(val) {
      this.email = val;
      let reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
      if (reg.test(this.email)) {
        this.$emit("handleChangeUrl", {url: 'mailto:' + this.email, title: this.email, cType: 'email'});
      }
    },
    _handleInputBlur() {
      let reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
      if (reg.test(this.email)) {
        this.isLinkEmail = true;
        this.$emit("handleChangeUrl", {url: 'mailto:' + this.email, title: this.email, cType: 'email'});
      } else {
        this.isLinkEmail = false;
      }
    }
  },
  watch: {
    selectedUrl() {
      this.email = this.curType == 'email' ? this.selectedUrl.split(':')[1] : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  .popup-content__title {
    font-size: 14px;
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
    font-size: 14px;
    line-height: 17px;
    visibility: hidden;
    span {
      margin-right: 8px;
      display: block;
      width: 12px;
      height: 12px;
      background: url("~@static/images/link/error_tips.png") no-repeat center
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
      color: #00C1DE;
      padding: 0 0 12px;
      font-size: 14px;
      line-height: 17px;
    }
    .way-list__box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
.popup-content__area /deep/ .el-input__inner {
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
</style>
