<template>
  <div id="app">
    <el-container>
      <el-header style="height:50px;position:fixed;width: 100%;z-index:1000">
        <m-header></m-header>
      </el-header>
      <el-container style="padding-top: 50px;width: 100%;overflow: hidden;">
        <el-aside width="50px">
          <m-aside></m-aside>
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

