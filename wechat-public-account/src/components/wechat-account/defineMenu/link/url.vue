<template>
  <div class="popup-content__area">
    <p class="popup-content__title">请输入网址</p>
    <el-input
      type="url"
      v-model="url"
      placeholder="以 http:// 或者 https:// 开通"
      @input="_handleInputChange"
      @blur="_handleInputBlur"
    ></el-input>
    <p class="error-tips" :style="{visibility: !isLinkUrl ? 'visible' : 'hidden'}">
      <span></span>请输入http://或者https://开头的正确网址
    </p>
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
    this.url = this.curType == "link" ? this.selectedUrl : "";
  },
  methods: {
    _handleInputChange(val) {
      this.url = val;
      let reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
      if (reg.test(this.url)) {
        this.$emit("handleChangeUrl", {
          url: this.url,
          title: this.url,
          cType: "link"
        });
      }
    },
    _handleInputBlur() {
      let reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
      if (reg.test(this.url)) {
        this.isLinkUrl = true;
        this.$emit("handleChangeUrl", {
          url: this.url,
          title: this.url,
          cType: "link"
        });
      } else {
        this.isLinkUrl = false;
      }
      console.log(this.isLinkUrl);
    }
  },
  watch: {
    selectedUrl() {
      this.url = this.curType == "link" ? this.selectedUrl : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  .popup-content__title {
    font-size: 14px;
    font-family: "PingFangSC";
    font-weight: 400;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
    padding: 24px 24px 12px;
    cursor: auto;
  }
  .error-tips {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 24px;
    padding-top: 16px;
    padding-bottom: 10px;
    font-family: 'PingFangSC';
    font-weight: 400;
    color: rgba(38, 38, 38, 1);
    line-height: 20px;
    visibility: hidden;
    span {
      margin-right: 8px;
      display: block;
      width: 18px;
      height: 18px;
      background: url("~img/jian-icon.png") no-repeat center center;
      background-size: 100% 100%;
    }
  }
}
</style>

<style scoped>
.way-list__box /deep/ .el-radio__label {
  font-size: 12px;
  color: #262626;
}
.way-list__box /deep/ .is-checked .el-radio__inner {
  border-color: #00c1de;
  background: #00c1de;
}
.popup-content__area /deep/ .el-input__inner {
  margin-left: 24px;
  width: 420px;
  height: 36px;
  line-height: 36px;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #c9d9dc;
  text-align: left;
  background: rgba(255, 255, 255, 1);
}
</style>
