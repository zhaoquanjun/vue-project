<template>
  <div class="popup-content__area">
    <p class="popup-content__title">请输入电话</p>
    <el-input
      type="tel"
      size="small"
      v-model="tel"
      placeholder="请输入电话"
      maxLength="11"
      @input="_handleInputChange"
      @blur="_handleInputBlur"
    ></el-input>
    <p class="error-tips" :style="{visibility: !isLinkTel ? 'visible' : 'hidden'}">
      <span></span>请输入正确的电话号码
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
      tel: "",
      isLinkTel: true
    };
  },
  created() {
    this.tel = this.curType == 'tel' ? this.selectedUrl.split(':')[1] : '';
  },
  methods: {
    _handleInputChange(val) {
      this.tel = val;
      let reg = /^1[3456789]\d{9}$/;
      if (reg.test(this.tel)) {
        this.$emit("handleChangeUrl", {url: 'tel:' + this.tel, title: this.tel, cType: 'tel'});
      }
    },
    _handleInputBlur() {
      let reg = /^1[3456789]\d{9}$/;
      if (reg.test(this.tel)) {
        this.isLinkTel = true;
        this.$emit("handleChangeUrl", {url: 'tel:' + this.tel, title: this.tel, cType: 'tel'});
      } else {
        this.isLinkTel = false;
      }
    }
  },
  watch: {
    selectedUrl() {
      console.log(this.curType, this.selectedUrl)
      this.tel = this.curType == 'tel' ? this.selectedUrl.split(':')[1] : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  .popup-content__title {
    font-size: 14px;
    line-height: 17px;
    color: $--color-primary;
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
      background: url("~img/link/error_tips.png") no-repeat center
        center;
      background-size: 100% 100%;
    }
  }
}
.popup-content__area {
  .el-input__inner {
    margin-left: 12px;
    width: 560px;
    padding-left: 8px;
    border-radius: 0;
    text-align: left;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(229, 229, 229, 1);
  }
} 
</style>
