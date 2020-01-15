<template>
  <div class="popup-content__area">
    <p class="popup-content__title">请填写邮件地址</p>
    <el-input
      v-model="email"
      type="email"
      size="small"
      placeholder="如：xxx@clouddream.net"
      @input="_handleInputChange"
      @blur="_handleInputBlur"
    ></el-input>
    <p
      class="error-tips"
      :style="{visibility: !isLinkEmail ? 'visible' : 'hidden'}"
    >
      <span></span>请输入正确的邮箱地址
    </p>
    <div class="popup-content__open">
      <p>页面打开方式</p>
      <div class="way-list__box">
        <el-radio
          v-model="target"
          label="_self"
          @change="_handleChageLinkTarget('_self')"
        >当前窗口打开</el-radio>
        <el-radio
          v-model="target"
          label="_blank"
          style="margin-left: 24px;"
          @change="_handleChageLinkTarget('_blank')"
        >新窗口打开</el-radio>
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
    way: {
      type: String
    },
    curType: {
      type: String
    }
  },
  data() {
    return {
      email: '',
      isLinkEmail: true
    }
  },
  computed: {
    selectedUrl: {
      get: function() {
        console.log(this.model['Href'])
        return this.curType === 'email' ? this.model['Href'].slice(7) : ''
      },
      set: function() {}
    },
    target: {
      get: function () {
        return this.way;
      },
      set: function () { }
    }
  },
  mounted() {
    this.email = this.curType === 'email' ? this.model['Href'].slice(7) : ''
  },
  methods: {
    _handleInputChange(val) {
      this.email = val
      this.$emit('handleChangeUrl', {
        url: 'mailto:' + this.email,
        title: this.email,
        cType: 'email',
        id: '',
        categoryId: null
      })
    },
    _handleInputBlur() {
      const reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
      if (reg.test(this.email)) {
        this.isLinkEmail = true
      } else {
        this.isLinkEmail = false
      }
      this.$emit('handleChangeUrl', {
        url: 'mailto:' + this.email,
        title: this.email,
        cType: 'email',
        categoryId: null,
        id: ''
      })
    },
    _handleChageLinkTarget(val) {
      this.$emit('handleChangeTarget', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-content__area {
  min-height: 320px;
  border-left: $--border-base;
  .popup-content__title {
    font-size: 14px;
    line-height: 17px;
    padding: 20px 24px 16px;
    cursor: auto;
  }
  .error-tips {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 24px;
    padding-top: 8px;
    padding-bottom: 90px;
    font-size: 14px;
    line-height: 17px;
    visibility: hidden;
    span {
      margin-right: 8px;
      display: block;
      width: 12px;
      height: 12px;
      background: url("~img/jian-icon.png") no-repeat center
        center;
      background-size: 100% 100%;
    }
  }
  .popup-content__open {
    margin-right: 16px;
    padding: 16px 0 24px 24px;
    width: 566px;
    border-top: $--border-base;
    p {
      padding: 0 0 12px;
      font-size: 14px;
      line-height: 20px;
    }
    .way-list__box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
.popup-content__area /deep/ .el-input__inner {
  margin-left: 24px;
  width: 560px;
  height: 32px;
  line-height: 32px;
  padding-left: 16px;
  border-radius: 0;
  text-align: left;
  background: $--color-white;
  border: $--border-base;
}
</style>
