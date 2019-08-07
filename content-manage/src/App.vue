<template>
    <div id="app">
        <el-container>
            <el-header class="common-header">
                <m-header></m-header>
            </el-header>
            <el-container class="common-container"
            >
                <el-aside class="common-aside">
                    <m-aside></m-aside>
                </el-aside>
                <el-main style=" overflow: hidden;">
                    <el-container>
                        <el-aside class="page-sub-aside" width="100px" v-show="isSub">
                            <page-submenu>
                                <i slot="title">内容管理</i>
                            </page-submenu>
                        </el-aside>
                        <el-main class="content-table-wrap" >
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
    }
};
</script>
<style >
@import url("./assets/quill.css");

.common-header {
    height: 60px;
    line-height: 60px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1001;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}
.common-container{
  padding-top: 60px;width: 100%;overflow: hidden;
}
.common-aside{
  width:70px !important;
   position: relative;
   overflow: visible !important;
}
.content-table-wrap{
    margin-top: 24px;
}
</style>

