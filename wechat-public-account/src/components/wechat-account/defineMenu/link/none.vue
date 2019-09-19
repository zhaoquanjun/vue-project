<template>
  <div class="popup-content__none">
    <h5>请输入网址</h5>
    <input @keyup="_handleChangeUrl" placeholder="请输入网站" v-model="url">
    <div class="tips">请输入正确网址</div>
  </div>
</template>

<script>
export default {
  props: {
    noneUrl: {
      type: String
    }
  },
  data(){
    return {
      url: ''
    }
  },
  methods: {
    _handleChangeUrl(){
      let data = {
        url: this.url,
        cType: 'Url',
        title: null,
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
