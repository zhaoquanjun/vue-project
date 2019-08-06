<template>
  <div id="app">
    <el-container>
      <el-header  style="height:60px;line-height: 60px;position:fixed;    top: 0;
    left: 0;width: 100%;z-index:1000">
        <m-header></m-header>
      </el-header>
      <el-container style="padding-top: 60px;width: 100%;overflow: hidden;">
        <el-aside width="80px"  style="position: relative;overflow: visible;">
          <m-aside ></m-aside>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import MHeader from "@/components/common/MHeader";
import MAside from "@/components/common/MAside";
export default {
  components: {
    MHeader,
    MAside
  },
};
</script>
<style scope>
.el-main{
  padding: 0;
}
.el-container .el-header {
  padding: 0;
}
</style>

