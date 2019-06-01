<template>
  <div id="app">
    <el-container>
      <el-header>
        <m-header></m-header>
      </el-header>
      <el-container>
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
  }
};
</script>
<style scope>
.el-container .el-header {
  padding: 0;
}
</style>

<style lang="scss">
@import "./assets/reset.css";
</style>
