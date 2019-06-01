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
          @mouseenter="collapseOpen(150,0)"
          :index="item.id"
          :key="item.id"
        >
          <i class="el-icon-menu"></i>
          <span>{{item.name}}</span>
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
        { name: "控制台", id: "1" },
        { name: "内容管理", id: "2" },
        { name: "网站管理", id: "3" },
        { name: "小程序管理", id: "4" },
        { name: "微信公众号", id: "5" },
        { name: "表单管理", id: "6" },
        { name: "电商会员", id: "7" },
        { name: "系统设置", id: "8" },
        { name: "回收站", id: "9" }
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
      this.navList = [
        { name: "控制台", id: "1" },
        { name: "内容管理", id: "2" },
        { name: "网站管理", id: "3" },
        { name: "小程序管理", id: "4" },
        { name: "微信公众号", id: "5" },
        { name: "表单管理", id: "6" },
        { name: "电商会员", id: "7" },
        { name: "系统设置", id: "8" },
        { name: "回收站", id: "9" }
      ];
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
.m-asideleft {
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

