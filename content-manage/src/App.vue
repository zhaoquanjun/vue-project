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
              <page-submenu></page-submenu>
            </el-aside>
            <el-main class="content-table-wrap">
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
import MContainer from "@/components/common/MContainer";
export default {
  components: {
    MHeader,
    MAside,
    PageSubmenu,
    MContainer
  },
  computed: {
    isSub() {
      return this.$route.meta.isSub;
    }
  },
  mounted() {
    this.$store.commit("SETSITEIDTOCOOKIE");
  }
};
</script>

<style>
@import url("./assets/quill.css");

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
