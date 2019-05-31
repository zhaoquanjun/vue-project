<template>
  <div
    class="m-aside"
    :style="{width:width+'px',transition: 'width .5s linear',backgroundColor:'#fff'}"
    @mouseenter="collapseOpen(150,0.8)"
    @mouseleave="collapseClose"
  >
    <el-aside class="m-asideleft" :style="{width:width+'px'}">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo">
        <el-menu-item
         v-for="(item) in navList"
         @mouseenter="collapseOpen(150,0)" :index="item.uid"
         :key="item.uid"
         >
          <i class="el-icon-menu"></i>
          <span>{{item.content}}</span>
        </el-menu-item>
       
      </el-menu>
    </el-aside>
    <LeftNavComponents
      :style="{width:width1+'px !important',transition: 'width '+time+' linear',backgroundColor:'#fff'}"
      class="m-asideright"
      :navList="navList"
    ></LeftNavComponents>
  </div>
</template>
<script>
import LeftNavComponents from "../aside/LeftNavComponents";

export default {
  data() {
    return {
      flag: 0,
      width: 50,
      width1: 0,
      time: "0.8s",
      navList: [
        { content: "网站管理1", uid: '1' },
        { content: "网站管理1", uid: '2' },
        { content: "网站管理1", uid: '3' },
        { content: "网站管理1", uid: '4' },
        { content: "网站管理1", uid: '5' },
        { content: "网站管理1", uid: '6' },
        { content: "网站管理1", uid: '7' },
        { content: "网站管理1", uid: '8' }
      ]
    };
  },
  components: {
    LeftNavComponents
  },
  methods: {
    collapseOpen(width, time) {
      this.width = width;
      this.width1 = width;
      this.time = time + "s";

      this.navList =  [
        { content: "网站管理1", uid: '1' },
        { content: "网站管理1", uid: '2' },
        { content: "网站管理1", uid: '3' },
        { content: "网站管理1", uid: '4' },
        { content: "网站管理1", uid: '5' },
        { content: "网站管理1", uid: '6' },
        { content: "网站管理1", uid: '7' },
        { content: "网站管理1", uid: '8' }
      ]
    },
    collapseClose() {
      this.width = 50;
      this.width1 = 0;
      this.time = "0s";
    }
  }
};
</script>

<style scoped>
.m-aside {
  position: absolute;
  left: 0;
  z-index: 10;
 
}
.m-asideleft{
  overflow: hidden; 
}
.m-asideright {
  width: 0px !important;
  position: absolute;
  left: 150px;
  z-index: 10;
  top: 0;
  text-align: center;
   overflow: hidden; 
}
.el-menu /deep/ .el-menu-item {
  padding: 0 !important;
  margin: 0 15px !important;
  text-align: left !important;
}
.el-menu /deep/ .el-menu-item span {
  margin-left: 10px;
}
</style>

