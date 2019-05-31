<template>
  <div class="header">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="head-left head-item">
          <span>Logo</span>
          <span>云～速成美站</span>
          <span>进入设计</span>
        </div>
      </el-col>
      <el-col :span="8" :offset="8">
        <div class="head-right head-item">
          <span>立即发布</span>
          <span>帮助</span>
          <span>通知</span>
          <span 
             @mouseenter="dropdownAvatarShow"
             @mouseleave="dropdownAvatarhide"
          >
            <p class="avatar"><img src="" alt></p>
            <dl class="login-set dropdown-avatar-menu" v-show = "isdropdownAvatarShow">
              <dd @click="pannelShow">个人设置</dd>
              <dd>退出控制台</dd>
            </dl>
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data(){
    return {
      isdropdownAvatarShow:false
    }
  },
  methods:{
    pannelShow(){
      this.$store.commit("CLOSERIGHTPANNEL",true)
    },
    dropdownAvatarShow(){
      this.isdropdownAvatarShow =true;
    },
    dropdownAvatarhide(){
      this.isdropdownAvatarShow =false;
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  padding: 0 10px;
  height: 50px;
  line-height: 50px;
  background: #000;
  color: #fff;
  position: relative;
  .head-item {
    span {
      display: inline-block;
      vertical-align: middle;
      padding: 0 15px
      // margin-right: 10px;
    }
  }
  .head-right {
    text-align: right;
  }
  .avatar{
    display: inline-block;
    width: 30px;
    height: 30px;
    vertical-align: middle;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .login-set {
    cursor: pointer;
    text-align: left;
    background: #000;
    position: absolute;
    z-index: 100;
    right: 0;
    top: 50px;
    color: #fff;
    padding: 10px 30px;
   dd{
     line-height: 30px;
   }
  }
}
</style>


