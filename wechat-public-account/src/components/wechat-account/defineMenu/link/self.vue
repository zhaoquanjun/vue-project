<template>
  <div class="popup-content__none">
    <h5>请输入网址</h5>
    <input @blur="_handleChangeUrl" placeholder="请输入网站" v-model="url">
    <div v-if="isUrl" class="tips ym-form-item__error">请输入正确网址</div>
  </div>
</template>

<script>
import { reg } from "@/utlis/index.js";
export default {
  props: {
    noneUrl: {
      type: String
    }
  },
  data(){
    return {
      url: '',
      isUrl: false
    }
  },
  methods: {
    _handleChangeUrl(){
      console.log('999',this.url)
      if(!reg.test(this.url)){
        this.isUrl = true
        return
      } else {
        this.isUrl = false
      }
      let regs =  new RegExp(/^(http|https)/)
      if(!regs.test(this.url)) {
        this.url = 'http://' + this.url
      }
      let data = {
        url: this.url,
        cType: 'Url',
        title: this.url,
        id: null
      }
      this.$emit('handleChangeUrl',data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .popup-content__none {
    width: 100%;
    height: 100%;
    padding-left: 24px;
    h5 {
      height:20px;
      font-size:14px;
      font-family:"PingFangSC";
      font-weight:400;
      color:rgba(38,38,38,1);
      line-height:20px;
      margin: 20px 0 10px;
    }
    input {
      width:470px;
      height:40px;
      padding-left: 10px;
      background:rgba(255,255,255,1);
      border-radius:2px;
      border:1px solid rgba(5,149,230,1);
    }
    .tips {
      margin-top: 10px;
      font-size:14px;
      font-family:"PingFangSC";
      font-weight:400;
      color:rgba(38,38,38,1);
      line-height:20px;
    }
  }
</style>
