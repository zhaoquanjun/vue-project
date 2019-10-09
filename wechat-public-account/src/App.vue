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
          <el-container>
            <el-aside class="page-sub-aside" width="100px" v-show="isSub">
              <page-submenu></page-submenu>
            </el-aside>
            <el-main class="content-table-wrap">
              <router-view />
              <!-- <MyDialog v-if="$store.state.isAsideDialogShow"></MyDialog> -->
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
import MyDialog from "@/components/common/my-dialog.vue";
export default {
  components: {
    MHeader,
    MAside,
    PageSubmenu,
    MyDialog
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
  line-height: 50px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  z-index: 100;
}
.common-container {
  padding-top: 50px;
  width: 100%;
}
.common-aside {
  width: 60px !important;
  min-height: calc(100vh - 60px);
  position: relative;
  overflow: visible !important;
  /* z-index: 200; */
  padding-top: 16px;
}
.content-table-wrap {
  position: relative;
}
</style>

