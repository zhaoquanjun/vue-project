<template>
  <el-aside>
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" >
      <el-menu-item v-for="(item,index) in menuList.children" :key="index" :index="item.menuUrl.split('/')[1]" @click="handlerRoute(item)">
        <span>{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<script>
import { checkHasRootSkip } from "@/api/index";
export default {
  props: ["menuList"],
  data(){
    return {
      curWebsite:"dashboard.console.wezhan.cn"
    }
  },
  methods: {
    handlerRoute(item){
       let [a,b]= item.menuUrl.split('/')
      if(this.curWebsite == a){
           this.$router.push(item.path)
      }else{
        window.location.href ='//'+ item.menuUrl
      }
    }
  }
};
</script>

<style scoped>
  .el-menu /deep/ .el-menu-item{
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    border-right: 1px solid #e5e5e5
  }
  .el-menu /deep/ :hover.el-menu-item{
    color: #15C6E0;
    background: #fff;
  }
</style>
