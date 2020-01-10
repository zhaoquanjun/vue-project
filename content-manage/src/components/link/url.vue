<template>
  <div class="popup-content__area">
    <p class="popup-content__title">请填写链接地址</p>
    <el-input
      v-model="url"
      type="url"
      size="small"
      placeholder="如：www.clouddream.net"
      @blur="_handleInputBlur"
    ></el-input>
    <p
      class="error-tips"
      :style="{ visibility: !isLinkUrl ? 'visible' : 'hidden' }"
    >
      <span></span>请输入正确的链接地址
    </p>
    <div class="popup-content__open">
      <p>页面打开方式</p>
      <div class="way-list__box">
        <el-radio
          v-model="way"
          label="_self"
          @change="_handleChageLinkTarget('_self')"
        >当前窗口打开</el-radio>
        <el-radio
          v-model="way"
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
      url: '',
      isLinkUrl: true
    }
  },
  computed: {
    selectedUrl: {
      get: function() {
        let url = ''
        if (this.curType === 'link') {
          const reg = /\/\//
          url = reg.test(this.model['Href']) ? this.model['Href'].slice(2) : this.model['Href']
        }
        return url
      },
      set: function() {}
    }
  },
  mounted() {
    this.url = this.selectedUrl
  },
  methods: {
    _handleInputBlur() {
      const reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
      const httpReg = /^http:\/\//
      const httpsReg = /^https:\/\//
      const homeReg = /\//
      if (reg.test(this.url) || homeReg.test(this.url)) {
        this.isLinkUrl = true
        let lastUrl = ''
        if (httpReg.test(this.url) || httpsReg.test(this.url)) {
          lastUrl = this.url
        } else if (this.url !== '/') {
          lastUrl = '//' + this.url
        }
        if (this.url === '/') {
          lastUrl = this.url
        }
        this.$emit('handleChangeUrl', {
          url: lastUrl,
          title: this.url,
          cType: 'link',
          categoryId: null,
          id: ''
        })
      } else {
        this.isLinkUrl = false
      }
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
    line-height: 20px;
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
    font-size: 12px;
    line-height: 17px;
    visibility: hidden;
    span {
      margin-right: 8px;
      display: block;
      width: 12px;
      height: 12px;
      background: url('~img/jian-icon.png') no-repeat center
        center;
      background-size: 100% 100%;
    }
  }
  .popup-content__open {
    margin-right: 16px;
    padding: 16px 0 0 24px;
    width: 566px;
    height: 78px;
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
  width: 470px;
  height: 40px;
  line-height: 40px;
  padding-left: 16px;
  border-radius: 2px;
  text-align: left;
  background: $--color-white;
  border: $--border-base;
}
</style>
