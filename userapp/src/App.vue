<template>
  <div id="app">
    <el-container>
      <el-header class="common-header">
        <m-header></m-header>
      </el-header>
      <el-container class="common-container">
        <el-aside class="common-aside">
          <m-aside></m-aside>
        </el-aside>
        <el-main>
          <router-view />
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
  }
};
</script>
<style>
.common-header {
  height: 50px !important;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
.common-container {
  padding-top: 50px;
  width: 100%;
}
.common-aside {
  width: 60px !important;
  position: relative;
  overflow: visible !important;
}
</style>

<style scope>
.el-main {
  padding: 0;
}
.el-container .el-header {
  padding: 0;
}
</style>

