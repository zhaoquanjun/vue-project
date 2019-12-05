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
        <el-main style=" overflow: hidden;">
          <el-container>
            <el-aside class="submenu-aside" v-show="isSub">
              <page-submenu>
                <i slot="title">模版管理</i>
              </page-submenu>
            </el-aside>
            <el-main class="page-scroll">
              <router-view />
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MHeader from "@/components/common/MHeader";
import MAside from "@/components/common/MAside";
import PageSubmenu from "@/components/common/PageSubmenu.vue";
export default {
  components: {
    MHeader,
    MAside,
    PageSubmenu
  },
  computed: {
    isSub() {
      return this.$route.meta.isSub;
    }
  }
};
</script>
<style >
.common-header {
  height: 50px !important;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}
.common-container {
  padding-top: 50px;
  width: 100%;
  overflow: hidden;
}
.common-aside {
  width: 60px !important;
  position: relative;
  overflow: visible !important;
}
</style>

