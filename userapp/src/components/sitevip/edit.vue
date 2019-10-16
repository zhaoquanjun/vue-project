<template>
  <div class="edit">
    <div class="code">
      <div class="title">
        <span>会员详情</span>
        <i @click="close(flase)" class="icon iconfont iconguanbi"></i>
      </div>
      <div class="header">
        <img src="" alt="">
        <p><span>用户名：</span><b>254645643</b></p>
        <p><span>注册时间：</span><b>2019-12-12 12:12</b></p>
        <p><span>注册来源：</span><b>网站名称qqq</b></p>
        <p><span>最近登录时间：</span><b>2019-12-12 12:12</b></p>
      </div>
      <div class="content">
        <h6>描述</h6>
        <el-input
          class="textarea"
          type="textarea"
          rows="5"
          v-model="description"
          placeholder="非必填，不超过120个字符，该摘要只在发送图文消息为单条时显示"
          maxlength="100"
          show-word-limit
          resize="none"
        ></el-input>
      </div>
      <div class="btn">
        <span class="sure" @click="close(true)">确定</span>
        <span @click="close(false)">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    vipId: {
      type:String
    }
  },
  data() {
    return {
      description: '',
    }
  },
  components: {
  },
  created(){
    this.init()
  },
  watch: {
    vipId() {
      this.init()
    },
  },
  methods: {
    init(){
      
    },
    close(){
      this.$emit('closeEdit')
    }
  }
};
</script>

<style lang="scss" scoped>
.edit {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background:rgba(38,38,38,0.8);
  text-align: right;
  font-family: "PingFangSC-Regular,PingFangSC";
  z-index: 2000;
  .code {
    position: relative;
    display: inline-block;
    width: 700px;
    height: 100%;
    background: white;
    .title {
      font-size:14px;
      font-weight:400;
      color:rgba(38,38,38,1);
      line-height:20px;
      display: flex;
      justify-content: space-between;
      padding: 20px 0 12px;
      margin: 0 24px;
      border-bottom: 1px solid #e5e5e5;
      i {
        cursor: pointer;
      }
    }
    .header {
      margin: 30px 24px 20px;
      height: 100px;
      background:rgba(248,250,252,1);
      border-radius:2px;
      padding: 28px 18px;
      img {
        float: left;
        width: 100px;
        height: 100px;
        margin-left: 18px;
        border-radius: 50%;
        background: url('~img/defualtAvater.png') no-repeat center center;
        background-size: 100% 100%;
      }
      p {
        font-size:14px;
        font-weight:400;
        color:rgba(161,168,177,1);
        line-height:20px;
        margin-left: 144px;
        text-align: left;
        margin-bottom: 6px;
        b {
          font-weight:400;
          color: #262626;
        }
      }
      p:last-child(){
        margin-bottom: 0px;
      }
    }
    .content {
      margin: 24px;
      h6 {
        font-size:14px;
        font-weight:400;
        color:rgba(161,168,177,1);
        line-height:20px;
        margin-bottom: 8px;
        text-align: left;
      } 
    }
    .btn {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 40px;
      box-sizing: content-box;
      width: 652px;
      padding: 20px 0;
      margin: 0 24px;
      border-top: 1px solid #e5e5e5;
      text-align: left;
      span {
        display: inline-block;
        width:76px;
        height:40px;
        border-radius:2px;
        border:1px solid rgba(9,204,235,1);
        font-size:14px;
        font-weight:400;
        color:rgba(9,204,235,1);
        line-height:40px;
        text-align: center;
        cursor: pointer;
      }
      .sure {
        background: rgba(9,204,235,1);
        color: #ffffff;
        margin-right: 16px;
      }
    }
  }
}
</style>